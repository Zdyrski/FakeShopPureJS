const api_url = "https://fakestoreapi.com/";

var users = [];
var carts = [];
var products = [];

//task 1
async function getapi(url, variable) {
    const response = await fetch(api_url + url);
    variable = await response.json();
    console.log(variable);
}

const fetchReq1 = fetch(api_url + 'users').then((res) => res.json());
const fetchReq2 = fetch(api_url + 'carts').then((res) => res.json());
const fetchReq3 = fetch(api_url + 'products').then((res) => res.json());
const allData = Promise.all([fetchReq1, fetchReq2, fetchReq3]);

//task 2
const categoryValue = () => {
    const sorted = products.reduce((r, a) => {
        r[a.category] = [...r[a.category] || [], a];
        return r;
    }, {});
    for (var key in sorted) {
        if (sorted.hasOwnProperty(key)) {
            sorted[key] = {
                ...sorted[key], totalPrice: sorted[key].reduce((sum, currentValue) => {
                    return sum + currentValue.price;
                }, 0)
            };
        }
    }
    return sorted;
}

//task3
const highestValueCart = () => {
    const result = carts.map((cart) => {
        let cartTotalPrice = cart.products.reduce((sum, currentValue) => {
            return sum + currentValue.quantity * products.find(product => product.id === currentValue.productId).price;
        }, 0);
        return { ...cart, totalPrice: cartTotalPrice };
    });
    const hvc = result.reduce((prev, current) => (prev.totalPrice > current.totalPrice) ? prev : current);
    const owner = users.find(user => user.id === hvc.userId).name;
    hvc.owner = owner.firstname + ' ' + owner.lastname;
    return hvc;
}

//task4
const twoFurthestUsers = () => {
    let pairs = [];
    for (let i = 0; i < users.length - 1; i++) {
        for (let j = i + 1; j < users.length; j++) {
            pairs.push([users.at(i), users.at(j)]);
        }
    }

    const pairsWithDistance = pairs.map((pair) => { let dist = calcCrow(pair[0].address.geolocation, pair[1].address.geolocation); return { ...pair, distance: dist } });
    pairsWithDistance.sort((a, b) => (a.distance > b.distance) ? 1 : -1);

    return pairsWithDistance.at(-1);
}

//task 4 - helper functions
function calcCrow(geolocation1, geolocation2) {
    var lat1 = geolocation1.lat;
    var lon1 = geolocation1.long;
    var lat2 = geolocation2.lat;
    var lon2 = geolocation2.long;
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat11 = toRad(lat1);
    var lat22 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat11) * Math.cos(lat22);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function toRad(Value) {
    return Value * Math.PI / 180;
}

function getResults() {
    console.log(categoryValue());
    console.log(highestValueCart());
    console.log(twoFurthestUsers());
}

allData.then((res) => { users = res[0]; carts = res[1]; products = res[2]; getResults() });
