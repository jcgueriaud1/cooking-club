# Package in production and deploy in Heroku

In this step we will:

- Package the application in production mode
- Create a heroku account
- Deploy the application in Heroku


## Package the application in production

Vaadin has a specific profile in maven to generate, optimize the bundle and build the application.

Navigate to your project folder and run:

```terminal
mvn clean package -Pproduction
```

This builds a production-optimized JAR file in the target folder.

## Deploy to Heroku

Create an account on Heroku: https://signup.heroku.com/

Install the client Heroku: https://devcenter.heroku.com/articles/heroku-cli

Log in:
```terminal
heroku login
```

Install the Java plugin:

```terminal
heroku plugins:install java
```

Create the new application. You need to choose a unique *APPNAME*:
```terminal
heroku create APPNAME
```

Add `system.properties` in the root of your project:
```
java.runtime.version=11
```

This will tell Heroku to use Java 11 instead of Java 8.

Deploy your production build. Don't forget to replace APPNAME with the chosen name:

```terminal
heroku deploy:jar target/cookingclub-1.0-SNAPSHOT.jar -a APPNAME
```

You can check the logs using this command:
```terminal
heroku logs --tail
```

And see your application by using this command:
```terminal
heroku open
```
