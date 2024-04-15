from locust import HttpUser, task, between

class TestCycle(HttpUser):
    wait_time = between(1, 1)  # Time between consecutive requests in seconds
    headers = {"Content-Type": "application/json", "Authorization": "Bearer Token"}
    @task(3)
    def get_orders(self):
        self.client.get("/api/orders/")

    @task(3)
    def get_products(self):
        self.client.get("/api/products/")

    @task(2)
    def post_signin(self):
        body = {
            "email": "test@test.com",
            "password": "123456"
        }
        headers = {"Content-Type": "application/json"}
        self.client.post("/api/users/signin/", json=body, headers=headers)

    @task(2)
    def get_profile(self):
        self.client.get("/api/users/profile/",headers=self.headers)

    @task(2)
    def get_shipping(self):
        
        shipping_id = "661d61e19deb2a657b2cf7ef"
        self.client.get(f"/api/shipping/{shipping_id}", headers=self.headers)

    @task(1)
    def post_orders(self):
        body = {
             "products":[
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