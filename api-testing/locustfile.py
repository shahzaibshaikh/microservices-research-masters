from locust import HttpUser, task, between

class TestCycle(HttpUser):
    wait_time = between(1, 1)  # Time between consecutive requests in seconds
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer Token"
        # Add your actual token here
    }
    count = 0

    @task(2)
    def get_orders(self):
        self.client.get("/api/orders/", headers=self.headers)

    @task(2)
    def get_order_by_id(self):
        order_id = "661dd89fd26901285c337579"
        self.client.get(f"/api/orders/{order_id}", headers=self.headers)

    @task(1)
    def post_orders(self):
        body = {
            "products": [
                {
                    "productId": "65e76419467cf523e9f01d7a",
                    "quantity": 3,
                    "amount": 7
                },
                {
                    "productId": "65e7643d467cf523e9f01d7c",
                    "quantity": 2,
                    "amount": 3
                }
            ]
        }
        self.client.post("/api/orders/", json=body, headers=self.headers)

    @task(1)
    def put_order_by_id(self):
        order_id = "661dd89fd26901285c337579"
        body = {
            "status": "success"
        }
        self.client.put(f"/api/orders/{order_id}", json=body, headers=self.headers)

    @task(1)
    def put_payment_by_id(self):
        payment_id = "661dd89fd26901285c337579"
        body = {
            "status": "processed"
        }
        self.client.put(f"/api/payments/{payment_id}", json=body, headers=self.headers)

    @task(2)
    def get_payment_by_id(self):
        payment_id = "661dd89fd26901285c337579"
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

    @task(4)
    def get_products(self):
        self.client.get("/api/products/", headers=self.headers)

    @task(3)
    def get_product_by_id(self):
        product_id = "65e76419467cf523e9f01d7a"
        self.client.get(f"/api/products/{product_id}", headers=self.headers)

    @task(1)
    def put_product_by_id(self):
        product_id = "65e76419467cf523e9f01d7a"
        body = {
            "name": "Updated Product",
            "price": 32
        }
        self.client.put(f"/api/products/{product_id}", json=body, headers=self.headers)

    @task(1)
    def post_review(self):
        product_id = "65e76419467cf523e9f01d7a"
        body = {
            "rating": 5,
            "text": "Great product!"
        }
        self.client.post(f"/api/reviews/{product_id}", json=body, headers=self.headers)

    @task(1)
    def put_review_by_id(self):
        review_id = "65e76555d5a7dab5b4965842"
        body = {
            "rating": 4,
            "text": "Updated review"
        }
        self.client.put(f"/api/reviews/{review_id}", json=body, headers=self.headers)

    @task(2)
    def get_review_by_id(self):
        review_id = "65e76555d5a7dab5b4965842"
        self.client.get(f"/api/reviews/{review_id}", headers=self.headers)

    @task(2)
    def get_shipping_by_id(self):
        shipping_id = "661dd89fd26901285c337579"
        self.client.get(f"/api/shipping/{shipping_id}", headers=self.headers)

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
