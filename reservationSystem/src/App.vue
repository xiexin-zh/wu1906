<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
html,
body,
div,
span,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
abbr,
address,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
samp,
small,
strong,
sub,
sup,
var,
b,
i,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
}
ul,
ol,
li {
  list-style-type: none;
}

html,
body {
  height: 100%;
}
input {
  background: none;
  outline: none;
  border: 1px solid #ccc;
}

#app {
  width: 100%;
  height: 100%;
}
.box_content {
  flex: 1;
  display: flex;
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
  .box_box {
    flex: 1;
    background-color: #fff;
    border-radius: 5px;
    padding: 15px;
    box-sizing: border-box;
    height: 100%;
  }
}
</style>
