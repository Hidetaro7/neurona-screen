const fetch = require('node-fetch')
const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/*

{"token_type":"Bearer","expires_in":15552000,"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJiZWUzMWVhZjgzNzg3ZjBjMzQ0YjY1MDZmZjg3MGFlZTlkYjJhMzAxMTc2M2Q4MjJiNWViOGJlZThmZGJiZGI3ZTM2ZDM5N2Q1NDkxMDg1In0.eyJhdWQiOiI0NTM3MDM1Ny44YzUxMmM4NjhiNDMyODFlNjZhOTM4YjVkNzdiNTFiOGRiOWIxMWU3MjIyYWNlODU0YTczMzNlZTUzYWY1ZDE2IiwianRpIjoiYmJlZTMxZWFmODM3ODdmMGMzNDRiNjUwNmZmODcwYWVlOWRiMmEzMDExNzYzZDgyMmI1ZWI4YmVlOGZkYmJkYjdlMzZkMzk3ZDU0OTEwODUiLCJpYXQiOjE2MTAwMjkxMTQsIm5iZiI6MTYxMDAyOTExNCwiZXhwIjoxNjI1NTgxMTE0LCJzdWIiOiI0NTM3MDM1NyIsInNjb3BlcyI6WyJyZWFkIl19.SaJFW12qOBi6S0-CiQ9xXBwDhjpT1AZ9rEB7jHDLVVmT68tmcCoJqVLoleCSrwp6CJxuReKBiahzLMk7cRwazLsuutTpTblfglNvPh4WSCoVS-nScYp6A1dgG5x8hgSMgl_vRdi6i5ApT1FoELLcWnItANsicEfy9CCLNawQ9qU6HMkwd_7C8ers8eKl9VVmL1xM7Y2sReXluztrY-yXuqyvo6qC9BeQxMJq2GvgXAd3Jj2LXaPS_le5SwCSI1hqUaH4fmX2q50CKJ27I0k4GpLBojsdBt-DByMTLk4qSaXAZmYCHDsTxeTakeiU2gn17nlBAvArGvadr4EFyytfIA"}%

curl -X GET "https://apiv2.twitcasting.tv/movies/189037369/comments?offset=10&limit=10" \
-H "Accept: application/json" \
-H "X-Api-Version: 2.0" \
-H "Authorization: Bearer {ACCESS_TOKEN}"

https://apiv2.twitcasting.tv/oauth2/authorize?client_id=45370357.8c512c868b43281e66a938b5d77b51b8db9b11e7222ace854a7333ee53af5d16&response_type=token&state={CSRF_TOKEN}

*/

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY2ZDI4YmVhZjdkOGQwOTgyN2FkYmE0NDNlOTdlN2M5YWFhYjFjMGYxZTdkOGRlMzE5YWIyMjRmYzQ5YmZhNTIyZWQzYzNiYWRjODhlMzIwIn0.eyJhdWQiOiI0NTM3MDM1Ny44YzUxMmM4NjhiNDMyODFlNjZhOTM4YjVkNzdiNTFiOGRiOWIxMWU3MjIyYWNlODU0YTczMzNlZTUzYWY1ZDE2IiwianRpIjoiNjZkMjhiZWFmN2Q4ZDA5ODI3YWRiYTQ0M2U5N2U3YzlhYWFiMWMwZjFlN2Q4ZGUzMTlhYjIyNGZjNDliZmE1MjJlZDNjM2JhZGM4OGUzMjAiLCJpYXQiOjE2MTAwMzI0NDAsIm5iZiI6MTYxMDAzMjQ0MCwiZXhwIjoxNjI1NTg0NDQwLCJzdWIiOiI0NTM3MDM1NyIsInNjb3BlcyI6WyJyZWFkIl19.jp1Nt5bxkNPOMB2F1QtzSYiWsvZWDP0CzbkHg_UVcz0A8ViCgnH3dxypV0RE8hXwXBP0nzbGcFH2x2U4xUimec7S5E18xu5tzH0QK_IJkzd5zXlZRdyxPy4JcFX5Uc3jUQH3-hLOM7bG7tI3cWAl1JL0WkRrkAwLZuWYYIsnqRfIKVv2tuHNxLsxfRRlapJZlFocnwhYPEPmBg_trg4-z-XW_FUJxVFj1fz-b6BSjNPCn_KD2QcDGXP75xI5DQTo5Ld41YYmQm1Ov8p7KbBGYonMMjwvHPxMKFJ8dPPNNY6NkzHrvXGvQtWohL3bFTLBxNKjn23D-_FxGGWg54QMxQ"

let all_count = 0

const fetchTwcas = () => {
    return new Promise((resolve, reject) => {
        fetch('https://apiv2.twitcasting.tv/movies/654623950/comments?limit=10', {
            headers: {
                'Content-Type': 'application/json',
                "X-Api-Version": "2.0",
                "Authorization": "Bearer " + token
            }
        }).then(res => res.json())
        .then(json => {
            resolve(json)
        }).catch(err => {
            console.error(err)
        })
    })
}

const checkNewComment = () => {
    fetchTwcas().then(json => {
        console.log(json.all_count , all_count)
        if(json.all_count - all_count !== 0) {
            console.log(json)
            const leftCount = json.all_count - all_count;
            const resultComments = []
            for(let i=0; i<leftCount; i++) {
                resultComments.push(json.comments[i])
               //console.log(json.comments[i])
            }
            //console.log(resultComments)
            io.emit('newComment', resultComments);
            all_count = json.all_count
        }
        setTimeout(checkNewComment,1000)
    })
}

io.on('connection', function(socket){
    setTimeout(checkNewComment, 3000)
  });
