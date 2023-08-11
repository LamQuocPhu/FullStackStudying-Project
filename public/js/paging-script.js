let limit = 8;
let thisPage = 1;
let list = document.querySelectorAll('.list .item');

function loadItem() {
    let beginGet = limit * (thisPage - 1);
    let endGet = limit * thisPage - 1;
    list.forEach((item, key) => {
        if (key >= beginGet && key <= endGet) {
            item.style.display = 'block';
        }
        else {
            item.style.display = 'none';
        }
    })
    listPage();
}
loadItem();
function listPage() {
    let count = Math.ceil(list.length / limit); //Math.ceil: làm tròn
    document.querySelector('.listPage').innerHTML = '';

    for (var i = 1; i <= count; i++) {
        let newPage = document.createElement('li');
        newPage.innerText = i;
        if (i == thisPage) {
            newPage.classList.add('active');
        }
        newPage.setAttribute('onclick', "changePage(" + i + ")");
        document.querySelector('.listPage').appendChild(newPage); // appendChild: nối chuỗi các số trang
    }
}

function changePage(i) {
    thisPage = i;
    loadItem();
}