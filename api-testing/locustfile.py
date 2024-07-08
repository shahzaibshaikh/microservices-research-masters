import random
from locust import HttpUser, LoadTestShape, TaskSet, task, constant, between
import math


class UserTasks():
    wait_time = between(4, 8)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer TOKEN"
        # Add your actual token here
    }
    count = 0

    
    @task(4)
    def get_orders(self):
        self.client.get("/api/orders/", headers=self.headers)

    @task(3)
    def get_order_by_id(self):
        order_id = "668056413fb165647fdbfa52"
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

    @task(3)
    def put_order_by_id(self):
        order_id = "668056413fb165647fdbfa52"
        body = {
            "status": "success"
        }
        self.client.put(f"/api/orders/{order_id}", json=body, headers=self.headers)

    @task(3)
    def put_payment_by_id(self):
        order_id = "66808672c51af6dcfcdb7497"
        body = {
            "status": "processed"
        }
        self.client.put(f"/api/payments/{order_id}", json=body, headers=self.headers)

    @task(4)
    def get_payment_by_id(self):
        order_id = "66808672c51af6dcfcdb7497"
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
        product_id = "6680575ba76b596169f9f28f"
        self.client.get(f"/api/products/{product_id}", headers=self.headers)

    @task(3)
    def put_product_by_id(self):
        product_id = "6680575ba76b596169f9f28f"
        body = {
            "name": "Updated Product",
            "price": 32
        }
        self.client.put(f"/api/products/{product_id}", json=body, headers=self.headers)

    # @task(1)
    # def post_review(self):
    #     product_id = "6644b832a281bbdd1e6904c7"
    #     body = {
    #         "rating": 5,
    #         "text": "Great product!"
    #     }
    #     self.client.post(f"/api/reviews/{product_id}", json=body, headers=self.headers)

    # @task(2)
    # def put_review_by_id(self):
    #     review_id = "66808745dc6885756b4ed54b"
    #     body = {
    #         "rating": 4,
    #         "text": "Updated review"
    #     }
    #     self.client.put(f"/api/reviews/{review_id}", json=body, headers=self.headers)

    # @task(2)
    # def get_review_by_id(self):
    #     product_id = "6680575ba76b596169f9f28f"
    #     self.client.get(f"/api/reviews/{product_id}", headers=self.headers)

    # @task(2)
    # def get_shipping_by_id(self):
    #     order_id = "66808672c51af6dcfcdb7497"
    #     self.client.get(f"/api/shipping/{order_id}", headers=self.headers)

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
    spawn_rate = 20

class SinusoidalLoadTestShape(LoadTestShape):
    min_users = 0
    max_users = 50
    period = 60  # Period of the sinusoidal wave in seconds
    time_limit = 2000000  # Total test duration in seconds

    def tick(self):
        run_time = self.get_run_time()

        if run_time < self.time_limit:
            # Calculate the phase angle based on the current run time and period
            phase_angle = (run_time % self.period) / self.period * (2 * math.pi)
            
            # Calculate the user count based on the sinusoidal wave
            user_count = self.min_users + (self.max_users - self.min_users) * (0.5 * (1 + math.sin(phase_angle)))
            
            return (int(user_count), int(user_count))
        else:
            return None