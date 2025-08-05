pipeline {
  agent any

  environment {
      EC2_USER_HOST = 'ubuntu@13.232.74.144'
      SITE_URL = 'https://envision.webcluesstaging.com/'
  }

  stages {
      stages {
        stage('Checkout Code') {
          steps {
            checkout scm
          }
      }
    stage('Run Deployment Script on Staging EC2') {
      steps {
        sshagent(credentials: ['envision-ssh-key']) {
          sh """
            ssh -o StrictHostKeyChecking=no $EC2_USER_HOST 'bash /home/ubuntu/scripts/frontend-deploy.sh'
          """
        }
      }
    }
  }

  post {
    always {
      script {
        def color = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'warning'][currentBuild.result] ?: 'warning'

        slackSend(
          channel: 'proj-envision',
          message: "Build: *${currentBuild.result}:* JOB ${env.JOB_NAME} build ${env.BUILD_NUMBER} \nMore info at: ${env.BUILD_URL} \nWeb-Site URL: ${env.SITE_URL}",
          color: color
        )
      }

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
