# Derash
- Derash Bill Management Platform which include Derash Biller System and Derash Agent System.

## Environment setup

Create a `.env` file in each service directory with the following keys:

`_Agent_System/.env`

```
AGENT_SESSION_SECRET=change-me
AGENT_API_KEY=your-agent-api-key
AGENT_API_SECRET=your-agent-api-secret
```

`_Biller_System/.env`

```
BILLER_SESSION_SECRET=change-me
BILLER_API_KEY=your-biller-api-key
BILLER_API_SECRET=your-biller-api-secret
```

Do not commit `.env` files. See `.gitignore`.

- Down below you may find the working production of of Derash National Billing Payment System (NBPS):

<a href="https://derash.gov.et"><img src="https://github.com/Kirubel-Eshetu/Derash/blob/mainDerash-logo.png" alt="Derash national billing payment system logo"></a>