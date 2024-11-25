import random
from locust import HttpUser, LoadTestShape, TaskSet, task, constant, between
import math
from datetime import datetime
import pytz


class UserTasks(TaskSet):
    wait_time = between(4, 8)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmIyZDE5ODkzNDllYzY1ZTZlYjRhYWIiLCJlbWFpbCI6InNoYWh6YWliQGdtYWlsLmNvbSIsImlhdCI6MTcyMjk5NTA5Nn0.YEIHE3Zg_S-ZzBRTnNP1XenESuCnjGODxcrkMjwhteo"
        # Add your actual token here
    }
    count = 0

    
    @task(3)
    def get_orders(self):
        self.client.get("/api/orders/", headers=self.headers)

    @task(2)
    def get_order_by_id(self):
        order_id = "66b2d35b221900d4a967b1b3"
        self.client.get(f"/api/orders/{order_id}", headers=self.headers)

    @task(2)
    def post_orders(self):
        body = {
            "products": [
                {
                    "productId": "661edf7bcb5fb9aa8129a725",
                    "quantity": 3,
                    "amount": 7
                },
                {
                    "productId": "661edfcbcb5fb9aa8129a72b",
                    "quantity": 2,
                    "amount": 3
                }
            ]
        }
        self.client.post("/api/orders/", json=body, headers=self.headers)

    @task(3)
    def put_order_by_id(self):
        order_id = "66b2d35b221900d4a967b1b3"
        body = {
            "status": "success"
        }
        self.client.put(f"/api/orders/{order_id}", json=body, headers=self.headers)

    @task(3)
    def put_payment_by_id(self):
        order_id = "66b2d35b221900d4a967b1b3"
        body = {
            "status": "processed"
        }
        self.client.put(f"/api/payments/{order_id}", json=body, headers=self.headers)

    @task(3)
    def get_payment_by_id(self):
        order_id = "66b2d35b221900d4a967b1b3"
        self.client.get(f"/api/payments/{order_id}", headers=self.headers)

    @task(1)
    def post_products(self):
        body = {
            "title": "New Product",
            "price": 53,
            "description": "New Product Description",
            "author": "John Black"
        }
        self.client.post("/api/products/", json=body, headers=self.headers)

    @task(2)
    def get_products(self):
        self.client.get("/api/products/", headers=self.headers)

    @task(4)
    def get_product_by_id(self):
        product_id = "66b2d35c6e4c17d1bb2f4b57"
        self.client.get(f"/api/products/{product_id}", headers=self.headers)

    @task(3)
    def put_product_by_id(self):
        product_id = "66b2d35c6e4c17d1bb2f4b57"
        body = {
            "name": "Updated Product",
            "price": 32
        }
        self.client.put(f"/api/products/{product_id}", json=body, headers=self.headers)

    @task(2)
    def post_review(self):
        product_id = "66b2d35c6e4c17d1bb2f4b57"
        body = {
            "rating": 5,
            "text": "Great product!"
        }
        self.client.post(f"/api/reviews/{product_id}", json=body, headers=self.headers)

    @task(2)
    def put_review_by_id(self):
        review_id = "66b2e863a8736b28ab347428"
        body = {
            "rating": 4,
            "text": "Updated review"
        }
        self.client.put(f"/api/reviews/{review_id}", json=body, headers=self.headers)

    @task(4)
    def get_review_by_id(self):
        product_id = "66b2d35c6e4c17d1bb2f4b57"
        self.client.get(f"/api/reviews/{product_id}", headers=self.headers)

    @task(6)
    def get_shipping_by_id(self):
        order_id = "66b2e997221900d4a967de4d"
        self.client.get(f"/api/shipping/{order_id}", headers=self.headers)

    # @task(1)
    # def post_register_user(self):
    #     self.count += 1
    #     body = {
    #         "email": f"test{self.count}@test.com",
    #         "password": "123456"
    #     }
    #     self.client.post("/api/users/register/", json=body, headers=self.headers)

    @task(2)
    def post_signin(self):
        body = {
            "email": "shahzaib@gmail.com",
            "password": "123456"
        }
        self.client.post("/api/users/signin/", json=body, headers=self.headers)

    @task(2)
    def get_user_profile(self):
        self.client.get("/api/users/profile/", headers=self.headers)


class WebsiteUser(HttpUser):
    host = "http://microservices-bookstore.dev"  # Replace with your actual host URL
    tasks = [UserTasks]
    wait_time = between(4, 8)  # Time between consecutive requests in seconds
class CustomSinusoidalLoadTestShape(LoadTestShape):
    min_users = 500
    max_users = 9000
    night_peak_amplitude = 140000
    daytime_peak_amplitude = 2500
    noise_factor = 0.07  # Noise factor for low-activity periods
    increased_noise_factor = 0.06  # Increased noise during low-activity periods
    peak_start_hour = 18  # 6 PM
    peak_end_hour = 21  # 11 PM
    peak_duration_hours = peak_end_hour - peak_start_hour  # Duration from 6 PM to 11 PM
    period_main = 86400  # 24 hours in seconds
    time_limit = 86400 * 14  # Two weeks duration
    
    spawn_rate = 99  # Constant spawn rate

    def get_current_seconds_since_midnight(self):
        # Get the current time in UTC and convert to EST
        utc_now = datetime.now(pytz.utc)
        est_now = utc_now.astimezone(pytz.timezone('America/New_York'))
        
        # Calculate seconds since midnight EST
        return est_now.hour * 3600 + est_now.minute * 60 + est_now.second

    def tick(self):
        current_seconds = self.get_current_seconds_since_midnight()
        
        # Calculate peak period start and end in seconds
        peak_start_seconds = self.peak_start_hour * 3600
        peak_end_seconds = self.peak_end_hour * 3600
        
        # Determine if current time is within the peak period
        in_peak_period = peak_start_seconds <= current_seconds <= peak_end_seconds
        
        if current_seconds < self.time_limit:
            # Baseline sinusoidal wave
            buser_count = 100000

            # Broad peaks during peak hours (6 PM to 11 PM)
            if in_peak_period:
                broad_peak_wave = self.night_peak_amplitude * math.sin(
                    math.pi * (current_seconds - peak_start_seconds) / (self.peak_duration_hours * 3600))
            else:
                broad_peak_wave = 0

            # Sharp peaks for sudden spikes during the day
            sharp_peak_wave = self.daytime_peak_amplitude * math.sin(
                (2 * math.pi / 1800) * current_seconds)  # Every 30 minutes

            # Combine the baseline with broad and sharp peaks
            user_count = baseline_wave + broad_peak_wave + sharp_peak_wave

            # Add random noise
            if in_peak_period:
                noise = random.uniform(-self.noise_factor, self.noise_factor) * self.night_peak_amplitude
            else:
                noise = random.uniform(-self.increased_noise_factor, self.increased_noise_factor) * self.max_users
            user_count += noise

            # Ensure user count does not go below the minimum
            user_count = max(self.min_users, user_count)

            # Debug prints
            print(f"Current time: {datetime.now(pytz.timezone('America/New_York')).strftime('%H:%M:%S')}")
            print(f"Current seconds: {current_seconds}")
            print(f"Peak start seconds: {peak_start_seconds}")
            print(f"Peak end seconds: {peak_end_seconds}")
            print(f"In peak period: {in_peak_period}")
            print(f"User count: {user_count}")

            return int(user_count), self.spawn_rate
        else:
            return None