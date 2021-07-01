# Cooking Club Workshop for SimpleWebConf

This project is the starting point for the Cooking Club Workshop given in [SimpleWebConf 2021](https://simplewebconf.com/), the slides are available [here](./Vaadin_SimpleWebConf%20-%20%20Cooking%20Club%20Workshop.pdf)

You need the following tools and libraries to complete the workshop:
- Java 8 or later and Maven. See [Installing Development Tools for instructions](https://vaadin.com/docs/v20/guide/install). The recommended Java version is Java 11.
- Visual Studio Code is used in this tutorial. See the setup instructions on [YouTube](https://www.youtube.com/watch?v=G_aJONwi0qo).

Unzip the downloaded file and open the project in your IDE. The instructions assume you use [VS Code](https://code.visualstudio.com/)

Open the project by either:
- Navigating to the project folder and running code . (note the period).
- Choosing File > Open... in VS Code and selecting the project folder.
Installing the following plugins in VS Code is recommended for an optimal development experience:
- [Java Extension Pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)
- [lit-plugin](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin)
- [Spring Boot Tools](https://marketplace.visualstudio.com/items?itemName=Pivotal.vscode-spring-boot)
VS Code should automatically suggest these for you when you open the project.

To run from the command line, use `mvn spring-boot:run` and open [http://localhost:8080](http://localhost:8080) in your browser.

All the steps for the workshop are in the docs folder, you can start in the main branch in [Step 1](docs/1__event-view.md)

## Project structure

| Directory                                  | Description                                                                                                                 |
| :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `frontend/`                                | Client-side source directory                                                                                                |
| &nbsp;&nbsp;&nbsp;&nbsp;`index.html`       | HTML template                                                                                                               |
| &nbsp;&nbsp;&nbsp;&nbsp;`index.ts`         | Frontend entrypoint, contains the client-side routing setup using [Vaadin Router](https://vaadin.com/router)                |
| &nbsp;&nbsp;&nbsp;&nbsp;`main-layout.ts`   | Main layout Web Component, contains the navigation menu, uses [App Layout](https://vaadin.com/components/vaadin-app-layout) |
| &nbsp;&nbsp;&nbsp;&nbsp;`views/`           | UI views Web Components (TypeScript)                                                                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;`styles/`          | Styles directory (CSS)                                                                                                      |
| `src/main/java/com/example/application`                 | Server-side source directory, contains the server-side Java views                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;`Application.java` | Server entrypoint                                                                                                           |
