# Automated Blue-Green Deployment with Jenkins, Docker, and Kubernetes

This project demonstrates a fully automated Blue-Green deployment strategy using a Jenkins CI/CD pipeline, Docker for containerization, and Kubernetes for orchestration.

## Prerequisites

- **Linux (Debian/Ubuntu)**
- **Docker** and **Docker Compose**
- **Minikube** installed and running
- **kubectl** configured to work with Minikube
- **Jenkins** (can be run via Docker)

---

## Project Structure

- `app/`: Simple Node.js application.
- `docker/`: Optimized Dockerfile.
- `k8s/`: Kubernetes Manifests (Blue/Green deployments and Service).
- `jenkins/`: Jenkinsfile for the CI/CD pipeline.

---

## Step-by-Step Instructions

### 1. Start Minikube
Ensure your local Kubernetes cluster is up:
```bash
minikube start
```

### 2. Initial Manual Deployment (Blue)
First, we deploy the internal "Blue" version manually to establish the baseline.

1. **Build and Push the Blue Image** (Update with your Docker Hub username):
   ```bash
   docker build -t yourusername/blue-green-sample-app:v1.0.0 -f docker/Dockerfile .
   docker push yourusername/blue-green-sample-app:v1.0.0
   ```

2. **Deploy Blue to Kubernetes**:
   Update `k8s/deployment-blue.yaml` with the image tag and run:
   ```bash
   kubectl apply -f k8s/deployment-blue.yaml
   kubectl apply -f k8s/service.yaml
   ```

3. **Verify the Running App**:
   ```bash
   minikube service sample-app-service --url
   ```
   Open the URL in your browser. You should see a **Blue** screen with **Version: v1.0.0**.

---

### 3. Setup Jenkins
If you don't have Jenkins, run it using Docker:
```bash
docker run -d -p 8080:8080 -p 50000:50000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v jenkins_home:/var/質量jenkins_home \
  --name jenkins jenkins/jenkins:lts
```

**Inside Jenkins:**
1. **Install Plugins**: Ensure "Docker Pipeline" and "Kubernetes" plugins are installed.
2. **Add Credentials**:
   - Go to `Manage Jenkins` > `Credentials`.
   - Add a "Username with password" credential.
   - **ID**: `docker-hub-credentials`.
   - **Username/Password**: Your Docker Hub login.
3. **Create Pipeline Job**:
   - Create a new "Pipeline" job named `blue-green-deploy`.
   - In the "Pipeline" section, select "Pipeline script from SCM" (if you've pushed this code to Git) OR paste the contents of `jenkins/Jenkinsfile` into the "Pipeline script" block (manually updating the `DOCKER_HUB_USER` variable).

---

### 4. Run the Pipeline (Deploy Green)
1. Trigger the Jenkins job.
2. The pipeline will:
   - Build a new image with the current build number.
   - Push it to Docker Hub.
   - Deploy it as `app-green`.
   - Verify health.
   - **Switch the Service selector** from `version: blue` to `version: green`.
3. Refresh your browser URL from Step 2.3. You should now see a **Green** screen with **Version: v2.0.0**.

---

## Verification & Rollback

- **Check Pods**: `kubectl get pods -l app=sample-app`
- **Check Service Selector**: `kubectl describe svc sample-app-service`
- **Manual Rollback**:
  ```bash
  kubectl patch service sample-app-service -p '{"spec":{"selector":{"version":"blue"}}}'
  ```

---

## Author
*Created by Antigravity*
