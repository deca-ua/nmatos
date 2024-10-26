# CI/CD Pipeline for Web Application Deployment

**Nuno Matos**  
*Mec.:* 97915  
*Date of Presentation:* October 23, 2024  

**Repository URLs:**

- **GitLab**: https://gitlab.com/nuno-matos/tdw-mp1-nuno-matos
- **GitHub**: https://github.com/deca-ua/tdw-mp1-nuno-matos

## Project Overview

This project focuses on building a Continuous Integration and Continuous Deployment (CI/CD) pipeline for a web application that I also created. The goal was to automate code testing, formatting, and deployment to a cloud hosting service. The pipeline was implemented primarily using GitLab, with GitHub utilized for replication and comparison purposes.

The web application is a lyrics finder that can also show music's preview, as well as a blog post from an artist's most recent album.

### Key Objectives
1. **Ensure Code Quality**: Integrate code validation tools (ESLint, Prettier, Jest) to maintain code quality.
2. **CMS Integration**: Use Contentful as the CMS for managing and fetching data.
3. **Automated Deployment**: Deploy to Netlify for streamlined project access.
4. **Pipeline Replication**: Replicate the CI/CD pipeline on GitHub for comparative analysis.

## Tools and Technologies

- **Node.js** - Core runtime for building and testing.
- **ESLint & Prettier** - Ensure code consistency and readability.
- **Jest** - Framework for automated testing in JavaScript.
- **GitLab & GitHub** - Version control and CI/CD pipelines.
- **Netlify** - Deployment platform for serving the application.
- **Power Automate** - Automation tool for notifications in Microsoft Teams.
- **Contentful** - CMS for data handling.

## Pipeline Stages

The pipeline was structured into two primary stages:

### 1. Build Stage
The `build_test` job installs dependencies, lints the code, formats it with Prettier, builds the project, and runs automated tests. This job:
   - Runs on Node.js versions 18 and 20, using a matrix to parallelize these.
   - Caches dependencies for faster builds to improve efficiency.
   - Only triggers on the main branch, ensuring stability.

### 2. Deploy Stage
The `deploy` job triggers upon successful completion of the `build_test` job. Key actions include:
   - Installing Netlify CLI and deploying the project to Netlify using an authentication token.
   - Sending a notification to Microsoft Teams via Power Automate, detailing build success or failure.

### Pipeline Trigger Configurations
The pipeline is set up to trigger on:
   - Pushes to the `main` branch.
   - Updates from the CMS (via Contentful webhooks).
   - Daily schedule at midnight.

Both repositories are also protected against direct pushes to the main branch, ensuring that a merge request from another branch is required.

## Implementation Details

The `.yml` file below defines the GitLab's pipeline steps, which is similar to the GitHub's pipeline:

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
      curl -H "Content-Type: application/json" -d "{\"message\":\"$MESSAGE\"}" "https://prod-140.westeurope.logic.azure.com:443/workflows/6f0e69eda2e7487999064344929457c0/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2tp5Q_vk21BUERBJWzDJw62hNP5HntaKBHPULaiUxkc"
  only:
    - main
  except:
    - tags
    - merge_requests
```

## Challenges Faced

- **Pipeline Performance**: The GitLab pipeline's execution time was longer than anticipated and could benefit from optimization.
- **API Integration**: Integrating with Spotify’s API presented unforeseen difficulties, which required additional handling.
- **Webhook Triggers**: Setting up Contentful’s webhook triggers posed some initial challenges for real-time updates.

## Key Learnings

Through this project, I gained practical experience with:

- **GitLab CI/CD and GitHub Actions** for robust CI/CD pipeline management.
- **Contentful CMS** for handling content data and automating deployment updates.
- **Microsoft Power Automate** for automated notifications, improving monitoring and debugging efficiency.

## Reflections and Conclusion

This project reinforced the importance of automation in modern web development and the benefits of CI/CD pipelines for reliable deployments. While some challenges remain, particularly around performance, this pipeline has streamlined the development process and laid a strong foundation for future improvements.


