# TDW MiniProject 1A - Continuous Integration and Deployment (CI/CD) Report

**Student:** Nuno Matos - 97915
**Project URL:** https://gitlab.com/nuno-matos/tdw-mp1-nuno-matos

## 1. Challenge Overview
The primary challenge of this project was to develop and implement a CI/CD pipeline for a React application using GitHub CI/CD, with replication on another CI/CD platform. The provided project aimed to create a continuous integration pipeline that:

- Validates the code quality using tools like ESLint and Prettier.
- Tests the application with Jest.
- Builds and deploys the application using Netlify.

Additionally, the pipeline was expected to support parallel execution across multiple Node.js versions and be automated for regular deployments.

## 2. Chosen Platforms
- **GitLab CI/CD:** Chosen for its integrated CI/CD features and compatibility with the team's development workflow. It was configured to manage the primary build, test, and deployment process.
- **GitHub Actions (Replication):** A similar CI/CD pipeline was replicated on GitHub Actions to compare its performance and workflow efficiency.

## 3. Technical Implementation

### 3.1 GitLab CI/CD Pipeline
The pipeline stages and tasks are detailed below:

**Stages:**

**Build:**
- Installs dependencies.
- Runs linting with ESLint and formatting with Prettier.
- Executes tests via Jest.
- Builds the project.

**Deploy:**
- Deploys the application to Netlify upon successful build.

**GitLab CI Configuration:**
```yaml
stages:
  - build
  - deploy

variables:
  NODE_VERSIONS: "20 18"

build_test:
  stage: build
  parallel:
    matrix:
      - NODE_VERSION: "20"
      - NODE_VERSION: "18"
  image: node:${NODE_VERSION}
  cache:
    key: "${CI_COMMIT_REF_SLUG}-${NODE_VERSION}"
    paths:
      - node_modules/
      - ~/.npm
      - ~/.cache
  script:
    - npm ci
    - npm run lint
    - npx prettier . --write
    - npm run build --if-present
    - npm test
  artifacts:
    paths:
      - build
  only:
    - main
  except:
    - tags
    - merge_requests

deploy:
  stage: deploy
  image: node:20
  needs: 
    - build_test
  script:
    - npm install netlify-cli -g
    - netlify deploy --prod --dir=build --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID
    - |
      MESSAGE="CI Build Result: $CI_JOB_STATUS on branch $CI_COMMIT_REF_NAME. View details here: $CI_JOB_URL"
      curl -H "Content-Type: application/json" -d "{\"message\":\"$MESSAGE\"}" "https://prod-140.westeurope.logic.azure.com/443/workflows/6f0e69eda2e7487999064344929457c0/triggers/manual/paths/invoke?..."
  only:
    - main
  except:
    - tags
    - merge_requests

```

### 3.2 GitHub Actions (Replication)

In GitHub Actions, the pipeline was replicated with some configuration changes to ensure parity. Key tasks included building, testing, and deploying the project using the same stages and tools as GitLab.

### 3.3 Differences Between Platforms

- **Integration Speed:** GitHub Actions provided quicker setup and pipeline running time, while GitLab, besides all the tries, still takes a lot more time to run the pipeline.
- **Tooling Integration:** Both platforms handled linting, testing, and deployment well, but GitHub Actions required more verbose configuration.

## 4. Key Challenges

- **Protected Branches on GitLab:** Encountered restrictions on pushing code to the protected main branch, which required resolving permissions for a successful push.
- **Pipeline Execution Time:** While GitLab performed well, the pipeline took longer than expected (~4 minutes and 40 seconds). Optimizing caching and reducing unnecessary steps were important for speeding up execution, which led to an improvement in the performance to about 2 minutes and 45 seconds.
- **Pipeline Exetution at midnight** Every day at midnight, the pipeline is suposed to run.
- **Pipeline Execution when CMS updated** Every time the CMS Contentful is changed, the pipeline must run, using webhooks.

## 5. Learnings

- **Node Version Management:** Running the pipeline with different Node.js versions (18 and 20) highlighted compatibility issues early, preventing potential deployment failures.
- **CI/CD Automation:** Implementing automated triggers (via webhooks) ensured that updates from the CMS (Contentful) would automatically redeploy the site without manual intervention.
- **Cross-Platform CI/CD:** Replicating the pipeline on both GitLab and GitHub Actions offered valuable insights into the trade-offs between different CI/CD services, especially when optimizing for build times and platform features.

## 6. Conclusion

This project allowed me to successfully implement a robust CI/CD pipeline using GitLab and replicate most of it on GitHub Actions. The most significant challenges were managing protected branch permissions and optimizing pipeline speed, which were addressed through improved caching and permission management.

The project not only provided valuable experience with CI/CD but also deepened my understanding of automation tools, versioning, and deployment strategies. Looking forward, I plan to optimize the deployment process further, particularly reducing build times and experimenting with other CI/CD platforms.
