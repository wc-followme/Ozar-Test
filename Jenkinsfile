pipeline {
  agent any

  environment {
    EC2_USER_HOST = 'ubuntu@13.232.74.144'
    SITE_URL = 'https://envision.webcluesstaging.com/'
  }

  stages {
    stage('Run only on qa branch') {
      when {
        expression {
          return env.BRANCH_NAME == 'qa' || env.GIT_BRANCH == 'origin/qa'
        }
      }
      stages {
        stage('Checkout Code') {
          steps {
            checkout scm
          }
        }

        stage('Run Deployment Script on Staging EC2') {
          steps {
            script {
              // Extract branch name from GIT_BRANCH (removes origin/ prefix if present)
              def branchName = env.GIT_BRANCH ? env.GIT_BRANCH.replaceAll(/^origin\//, '') : (env.BRANCH_NAME ?: 'unknown')
              def prNumber = env.CHANGE_ID ?: ''
              
              sshagent(credentials: ['envision-ssh-key']) {
                sh """
                  ssh -o StrictHostKeyChecking=no $EC2_USER_HOST "
                    export BUILD_NUMBER='${BUILD_NUMBER}' &&
                    export BRANCH_NAME='${branchName}' &&
                    export GIT_COMMIT='${GIT_COMMIT}' &&
                    export PR_NUMBER='${prNumber}' &&
                    bash /home/ubuntu/scripts/frontend-deploy.sh
                  "
                """
              }
            }
          }
        }
      }
    }
  }

  post {
    always {
      script {
        if (env.BRANCH_NAME == 'qa' || env.GIT_BRANCH == 'origin/qa') {
          def color = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'warning'][currentBuild.result] ?: 'warning'

          slackSend(
            channel: 'proj-envision',
            message: "Build: *${currentBuild.result}:* JOB ${env.JOB_NAME} build ${env.BUILD_NUMBER} \nMore info at: ${env.BUILD_URL} \nWeb-Site URL: ${env.SITE_URL}",
            color: color
          )

          emailext(
            subject: "Build Result: ${JOB_NAME}-Build# ${BUILD_NUMBER} ${currentBuild.result}",
            body: "${currentBuild.result}: ${BUILD_URL}",
            attachLog: true,
            compressLog: true,
            replyTo: 'harsh.solanki@codezeros.com',
            to: 'harsh.solanki@codezeros.com'
          )
        }
      }
    }
  }
}