<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    a{
      display:block;
      font-size:30px;
    }
  </style> 
</head>

<body>
  {{#each files}}
    <a href="{{../dir}}/{{file}}">【{{icon}}】-{{file}}</a>
  {{/each}}
</body>

</html>