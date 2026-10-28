# how to use

npx start -- --method=get_company_card --inn=7700000001 npm run card -- --inn=7700000001

add cli inn argument as array of inn

Accepts: --inn=7700000000 → ['7700000000'] --inn=7700000000,777000000 → ['7700000000', '777000000'] --inn=[7700000000, 777000000] → ['7700000000', '777000000'] --inn= → [] (no --inn at all) → []
