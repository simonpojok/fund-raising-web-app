src/
├── app/
│   ├── core/                    # Core module for services, guards, interceptors
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── services/
│   │   └── core.module.ts
│   ├── features/                # Feature modules
│   │   ├── auth/                # Auth module (login, signup)
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── auth.module.ts
│   │   └── dashboard/           # Dashboard module
│   │       ├── components/
│   │       ├── pages/
│   │       └── dashboard.module.ts
│   ├── shared/                  # Shared module for reusable components
│   │   ├── components/
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── shared.module.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.routes.ts
│   └── app.config.ts
├── assets/                      # Static assets
│   ├── images/
│   └── icons/
├── environments/                # Environment configuration
│   ├── environment.ts
│   └── environment.prod.ts
├── styles/                      # Global styles
│   ├── _variables.scss
│   └── _utilities.scss
├── styles.scss                  # Main styles entry point
├── main.ts
└── index.html
