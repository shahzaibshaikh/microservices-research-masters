import random
from locust import HttpUser, LoadTestShape, TaskSet, task, constant, between
import math


class UserTasks(HttpUser):
    wait_time = between(4, 8)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer Token"
        # Add your actual token here
    }
    count = 0

    
    @task(4)
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

    @task(3)
    def put_order_by_id(self):
        order_id = "661ee337633ab98f51985c2e"
        body = {
            "status": "success"
        }
        self.client.put(f"/api/orders/{order_id}", json=body, headers=self.headers)

    @task(3)
    def put_payment_by_id(self):
        payment_id = "661ee334633ab98f51985c24"
        body = {
            "status": "processed"
        }
        self.client.put(f"/api/payments/{payment_id}", json=body, headers=self.headers)

    @task(4)
    def get_payment_by_id(self):
        payment_id = "661ee334633ab98f51985c24"
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

    @task(4)
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
        review_id = "661ee4bde6254c704e7d3b29"
        body = {
            "rating": 4,
            "text": "Updated review"
        }
        self.client.put(f"/api/reviews/{review_id}", json=body, headers=self.headers)

    @task(2)
    def get_review_by_id(self):
        review_id = "661edf7bcb5fb9aa8129a725"
        self.client.get(f"/api/reviews/{review_id}", headers=self.headers)

    @task(2)
    def get_shipping_by_id(self):
        order_id = "661ee334633ab98f51985c24"
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


# class WebsiteUser(HttpUser):
#     host = "http://microservices-bookstore.dev"  # Replace with your actual host URL
#     tasks = [UserTasks]
#     wait_time = between(4, 8)  # Time between consecutive requests in seconds
#     spawn_rate = 20

# class SquareWaveLoadTestShape(LoadTestShape):
#     min_users = 0
#     max_users = 50
#     time_limit = 2000000  # Total test duration in seconds
#     period = 1500  # Duration of one complete period of the square wave pattern in seconds

#     def tick(self):
#         run_time = self.get_run_time()

#         # Calculate user count based on the square wave pattern
#         if run_time < self.time_limit:
#             # Calculate the phase angle based on the current run time and period
#             phase_angle = (run_time % self.period) / self.period * (2 * math.pi)
            
#             # Determine whether the square wave is in the high or low state based on the phase angle
#             is_high = phase_angle < math.pi
            
#             # Set the user count based on the square wave state
#             user_count = self.max_users if is_high else self.min_users
            
#             return (user_count, user_count)
#         else:
#             return None