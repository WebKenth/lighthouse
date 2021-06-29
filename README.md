# How to Run

```bash
yarn
```

Two scripts are included and can be run with 

```bash
yarn run production
#or
yarn run staging
```


to run lighthouse:

```bash
node index.js <subfolder>
```

It will report each score and save a .html file at `reports/<project>/<subfolder>/<report.name>.html`

If the subfolder is omitted it will be saved at `reports/<project>/<report.name>.html`

Running the test twice with same name will overwrite the previous run

# How does it work?

reports.json contains the projects and sites it ruuns

structure:
```json
[
    {
        "name": "<project-name>",
        "reports":
        [
            {
                "name": "<report-name>",
                "url": "<fully-qualified-url>"
            }
        ]
    }
]
```

You can add multiple projects and reports to suit your needs