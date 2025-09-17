auth Router

1. post : auth/sign-up
2. post : login
3. post : log-out

profile router

1. get : profile/view
2. patch : profile/update
3. patch : profile/password

connection request router

1. post : request/send/interested/:userId
2. post : request/send/ignore/:userId
3. get : request/review/accepted/:requestId
4. get: request/review/rejected/:requestId

5. get : user/connection.
6. get : request/received.
7. get : request/get/profile // it gets you the profile of other user.
