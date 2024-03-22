from robin_stocks import Robinhood as r

username = "josiahgriggs8@gmail.com"
password =  "Coder1633!"
mfa = "765697"
# Logic to handle login and possibly MFA here
data = r.login(username, password, mfa)


'client_id=c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS&expires_in=86400&grant_type=password&password=Coder1633%21&scope=internal&username=josiahgriggs8%40gmail.com&challenge_type=sms&device_token=d3e78c61-8641-2700-1e41-64c6a0511a10&mfa_code=225309'