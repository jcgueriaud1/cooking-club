# Custom project from start.vaadin.com

This project was created from https://start.vaadin.com. It's a fully working Vaadin application that you continue developing locally.
It has all the necessary dependencies and files to help you get going.

The project is a standard Maven project, so you can import it to your IDE of choice. All you need is to have Java 8+ installed.

To run from the command line, use `mvn` and open [http://localhost:8080](http://localhost:8080) in your browser.

## Project structure

| Directory                                  | Description                                                                                                                 |
| :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `frontend/`                                | Client-side source directory                                                                                                |
| &nbsp;&nbsp;&nbsp;&nbsp;`index.html`       | HTML template                                                                                                               |
| &nbsp;&nbsp;&nbsp;&nbsp;`index.ts`         | Frontend entrypoint, contains the client-side routing setup using [Vaadin Router](https://vaadin.com/router)                |
| &nbsp;&nbsp;&nbsp;&nbsp;`main-layout.ts`   | Main layout Web Component, contains the navigation menu, uses [App Layout](https://vaadin.com/components/vaadin-app-layout) |
| &nbsp;&nbsp;&nbsp;&nbsp;`views/`           | UI views Web Components (TypeScript)                                                                                        |
| &nbsp;&nbsp;&nbsp;&nbsp;`styles/`          | Styles directory (CSS)                                                                                                      |
| `src/main/java/<groupId>/`                 | Server-side source directory, contains the server-side Java views                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;`Application.java` | Server entrypoint                                                                                                           |

## What next?

[vaadin.com](https://vaadin.com) has lots of material to help you get you started:

- Follow the tutorials in [vaadin.com/tutorials](https://vaadin.com/tutorials).
- Read the documentation in [vaadin.com/docs](https://vaadin.com/docs/latest/).
- For a bigger Vaadin application example, check out the Full Stack App starter from [vaadin.com/start](https://vaadin.com/start).
