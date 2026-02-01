import requests
import sys
import json
from datetime import datetime

class AvocadoAPITester:
    def __init__(self, base_url="https://ai-website-shop.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data}"
            self.log_test("API Root", success, details)
            return success
        except Exception as e:
            self.log_test("API Root", False, f"Error: {str(e)}")
            return False

    def test_seed_data(self):
        """Test database seeding"""
        try:
            response = requests.get(f"{self.api_url}/seed", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data}"
            self.log_test("Database Seeding", success, details)
            return success
        except Exception as e:
            self.log_test("Database Seeding", False, f"Error: {str(e)}")
            return False

    def test_get_listings(self):
        """Test GET /api/listings"""
        try:
            response = requests.get(f"{self.api_url}/listings", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                listings_count = len(data)
                details += f", Found {listings_count} listings"
                
                # Check if we have the expected 5 sample listings
                if listings_count >= 5:
                    details += " (Expected sample data present)"
                else:
                    details += " (Warning: Expected 5+ listings)"
                    
                # Store first listing ID for detail test
                if listings_count > 0:
                    self.sample_listing_id = data[0].get('id')
                    details += f", Sample ID: {self.sample_listing_id}"
                    
            self.log_test("GET Listings", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_test("GET Listings", False, f"Error: {str(e)}")
            return False, []

    def test_get_listing_detail(self, listing_id):
        """Test GET /api/listings/{id}"""
        try:
            response = requests.get(f"{self.api_url}/listings/{listing_id}", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Title: {data.get('title', 'N/A')}"
                details += f", Price USD: ${data.get('price_usd', 'N/A')}"
                details += f", Price INR: ₹{data.get('price_inr', 'N/A')}"
                
            self.log_test("GET Listing Detail", success, details)
            return success
        except Exception as e:
            self.log_test("GET Listing Detail", False, f"Error: {str(e)}")
            return False

    def test_search_listings(self):
        """Test listings search functionality"""
        try:
            # Test search by title
            response = requests.get(f"{self.api_url}/listings?search=AI", timeout=10)
            success = response.status_code == 200
            details = f"Search Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Found {len(data)} results for 'AI'"
                
            self.log_test("Search Listings", success, details)
            return success
        except Exception as e:
            self.log_test("Search Listings", False, f"Error: {str(e)}")
            return False

    def test_filter_by_category(self):
        """Test listings category filtering"""
        try:
            # Test filter by category
            response = requests.get(f"{self.api_url}/listings?category=Marketing", timeout=10)
            success = response.status_code == 200
            details = f"Filter Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Found {len(data)} Marketing listings"
                
            self.log_test("Filter by Category", success, details)
            return success
        except Exception as e:
            self.log_test("Filter by Category", False, f"Error: {str(e)}")
            return False

    def test_create_submission(self):
        """Test POST /api/submissions"""
        try:
            test_submission = {
                "full_name": "Test Seller",
                "email": "test@example.com",
                "website_title": "Test AI Website",
                "category": "Productivity",
                "price": 99.99,
                "description": "A test AI website for automated testing",
                "demo_url": "https://demo.test.com",
                "upload_link": "https://github.com/test/repo"
            }
            
            response = requests.post(
                f"{self.api_url}/submissions", 
                json=test_submission,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                self.test_submission_id = data.get('id')
                details += f", Created submission ID: {self.test_submission_id}"
                details += f", Status: {data.get('status', 'N/A')}"
                
            self.log_test("Create Submission", success, details)
            return success
        except Exception as e:
            self.log_test("Create Submission", False, f"Error: {str(e)}")
            return False

    def test_get_admin_submissions(self):
        """Test GET /api/admin/submissions"""
        try:
            response = requests.get(f"{self.api_url}/admin/submissions", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Found {len(data)} submissions"
                
                # Check for our test submission
                if hasattr(self, 'test_submission_id'):
                    found_test = any(sub.get('id') == self.test_submission_id for sub in data)
                    details += f", Test submission found: {found_test}"
                    
            self.log_test("GET Admin Submissions", success, details)
            return success
        except Exception as e:
            self.log_test("GET Admin Submissions", False, f"Error: {str(e)}")
            return False

    def test_update_submission_status(self):
        """Test PUT /api/admin/submissions/{id}"""
        if not hasattr(self, 'test_submission_id'):
            self.log_test("Update Submission Status", False, "No test submission ID available")
            return False
            
        try:
            update_data = {"status": "approved"}
            
            response = requests.put(
                f"{self.api_url}/admin/submissions/{self.test_submission_id}",
                json=update_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Updated status: {data.get('status', 'N/A')}"
                details += f", Reviewed at: {data.get('reviewed_at', 'N/A')}"
                
            self.log_test("Update Submission Status", success, details)
            return success
        except Exception as e:
            self.log_test("Update Submission Status", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Avocado Marketplace API Tests")
        print("=" * 50)
        
        # Test API connectivity
        if not self.test_api_root():
            print("❌ API root test failed - stopping tests")
            return False
            
        # Test database seeding
        self.test_seed_data()
        
        # Test listings endpoints
        success, listings = self.test_get_listings()
        if success and listings:
            # Test listing detail with first listing
            if hasattr(self, 'sample_listing_id'):
                self.test_get_listing_detail(self.sample_listing_id)
        
        # Test search and filtering
        self.test_search_listings()
        self.test_filter_by_category()
        
        # Test submission workflow
        if self.test_create_submission():
            self.test_get_admin_submissions()
            self.test_update_submission_status()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = AvocadoAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "total_tests": tester.tests_run,
                "passed_tests": tester.tests_passed,
                "success_rate": f"{(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%",
                "timestamp": datetime.now().isoformat()
            },
            "test_results": tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())