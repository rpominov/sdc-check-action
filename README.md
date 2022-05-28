# [sdc-check](https://github.com/mbalabash/sdc-check) GitHub action

Example config:

```yaml
name: Check dependencies

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  validation:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Run sdc-check
        uses: rpominov/sdc-check-action@v1
```

For extra cofiguration, add a `.sdccheckignore` file and an `"sdc-check"` section in `package.json`.
See https://github.com/mbalabash/sdc-check#configure
