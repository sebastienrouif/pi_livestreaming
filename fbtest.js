var FB = require('fb'),
    fb = new FB.Facebook();

FB.setAccessToken('EAACEdEose0cBAP8uSt66AtoqAgMmBAhTHg4KERuT3gZCaWmypjM8jkAayflxBQd2Q50xBDxWYwUEk9VqNyNjiVxPQZCQXpTYZAcMxDmv1hGDtR7jbEQyWq1V2ShLvfozdzKm3NsOWr669M3yqm8vOFMDWmsfjcPnl75z1SuCAMaTlPKUZAAbVmBgIhV1dpI9jkhSAzxkMQ7ZCFgf1vgm2YbZAvrcZAgcHAZD');

var fs = require('fs');


var event_wedding_id = 1219917591379215,
    album_wedding_id = 114810819202282,
    group_wedding_id = 114809552535742;




// var body = 'hello world';
// FB.api('1219917591379215/feed', 'post', { message: body }, function (res) {
//   if(!res || res.error) {
//     console.log(!res ? 'error occurred' : res.error);
//     return;
//   }
//   console.log('Post Id: ' + res.id);
// });




FB.api(group_wedding_id+'/photos', 'post', { source: fs.createReadStream('pics/IMG_20170831_121718_020.jpg'), caption: 'It\'s happening =)' }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log('Post Id: ' + res.post_id);
});

// FB.api('me/photos', 'post', { source: { value: photoBuffer, options: { contentType: 'image/jpeg' } }, caption: 'It\'s happening =)' }, function (res) {
//   if(!res || res.error) {
//     console.log(!res ? 'error occurred' : res.error);
//     return;
//   }
//   console.log('Post Id: ' + res.post_id);
// });


// IDs
