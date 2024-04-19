import random
from locust import HttpUser, LoadTestShape, TaskSet, task, constant, between
import math


class UserTasks(TaskSet):
    # wait_time = between(1, 3)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer Token"
        # Add your actual token here
    }
    count = 0

    
    @task(1)
    def get_orders(self):
        self.client.get("/api/orders/", headers=self.headers)

    @task(3)
    def get_order_by_id(self):
        order_id = "661ee337633ab98f51985c2e"
        self.client.get(f"/api/orders/{order_id}", headers=self.headers)

    @task(1)
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

    @task(1)
    def put_order_by_id(self):
        order_id = "661ee337633ab98f51985c2e"
        body = {
            "status": "success"
        }
        self.client.put(f"/api/orders/{order_id}", json=body, headers=self.headers)

    @task(1)
    def put_payment_by_id(self):
        payment_id = "661ee337633ab98f51985c2e"
        body = {
            "status": "processed"
        }
        self.client.put(f"/api/payments/{payment_id}", json=body, headers=self.headers)

    @task(2)
    def get_payment_by_id(self):
        payment_id = "661ee337633ab98f51985c2e"
        self.client.get(f"/api/payments/{payment_id}", headers=self.headers)

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

    @task(3)
    def get_product_by_id(self):
        product_id = "661edf7bcb5fb9aa8129a725"
        self.client.get(f"/api/products/{product_id}", headers=self.headers)

    @task(3)
    def put_product_by_id(self):
        product_id = "661edf7bcb5fb9aa8129a725"
        body = {
            "name": "Updated Product",
            "price": 32
        }
        self.client.put(f"/api/products/{product_id}", json=body, headers=self.headers)

    @task(1)
    def post_review(self):
        product_id = "661edf7bcb5fb9aa8129a725"
        body = {
            "rating": 5,
            "text": "Great product!"
        }
        self.client.post(f"/api/reviews/{product_id}", json=body, headers=self.headers)

    @task(2)
    def put_review_by_id(self):
        review_id = "661ee384e6254c704e7d3af9"
        body = {
            "rating": 4,
            "text": "Updated review"
        }
        self.client.put(f"/api/reviews/{review_id}", json=body, headers=self.headers)

    @task(2)
    def get_review_by_id(self):
        review_id = "661ee384e6254c704e7d3af9"
        self.client.get(f"/api/reviews/{review_id}", headers=self.headers)

    @task(2)
    def get_shipping_by_id(self):
        order_id = "661ee337633ab98f51985c2e"
        self.client.get(f"/api/shipping/{order_id}", headers=self.headers)

    # @task(1)
    # def post_register_user(self):
    #     self.count += 1
    #     body = {
    #         "email": f"test{self.count}@test.com",
    #         "password": "123456"
    #     }
    #     self.client.post("/api/users/register/", json=body, headers=self.headers)

    @task(4)
    def post_signin(self):
        body = {
            "email": "test@test.com",
            "password": "123456"
        }
        self.client.post("/api/users/signin/", json=body, headers=self.headers)

    @task(2)
    def get_user_profile(self):
        self.client.get("/api/users/profile/", headers=self.headers)


class WebsiteUser(HttpUser):
    host = "http://microservices-bookstore.dev"  # Replace with your actual host URL
    tasks = [UserTasks]
    wait_time = between(1, 3)  # Time between consecutive requests in seconds
    spawn_rate = 20

class SinusoidalLoadTestShape(LoadTestShape):
    min_users = 50
    max_users = 1000
    time_limit = 2000000  # Total test duration in seconds
    period = 180  # Duration of one complete period of the sinusoidal pattern in seconds

    def tick(self):
        run_time = self.get_run_time()

        # Calculate user count based on the sinusoidal pattern
        if run_time < self.time_limit:
            # Calculate the phase angle based on the current run time and period
            phase_angle = (run_time % self.period) / self.period * (2 * math.pi)
            
            # Calculate the value of the sinusoidal function
            sine_value = math.sin(phase_angle)
            
            # Scale and shift the sine value to fit the range between min_users and max_users
            user_count = (sine_value + 1) / 2 * (self.max_users - self.min_users) + self.min_users
            
            return (round(user_count), round(user_count))
        else:
            return None