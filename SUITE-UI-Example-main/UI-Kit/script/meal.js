
// 이 곳에 나이스 API 키를 입력하세요.
const APIKey = "fd28d46dcb2c4e1aa9563d4d593a748d"

// 이 곳에 시도교육청 코드를 입력하세요.
const AOSC = "N10"

// 이 곳에 표준학교 코드를 입력하세요.
const SSC = "8140472"

ftime = 0
mealType = 0
dayOfWeek = 10
var week = new Array('일', '월', '화', '수', '목', '금', '토');

// 정규식으로 알레르기 정보 제거
function RX(item) {
    return item.replace(/\([^)]*\)/g, '');
}

// 당일 급식 정보 반환
async function todayMeal(API_URL) {
    response = await fetch(API_URL);
    result = await response.json();
    mealData = result.mealServiceDietInfo[1];

    let mealInfo = [];

    mealData['row'].forEach(i => {
        mealTime = i['MMEAL_SC_NM'];
        mealList = RX(i['DDISH_NM']);

        mealInfo.push([mealTime, mealList]);
    });
    return mealInfo;
}

async function syncMeal(API_URL, n) {
    mealinfo = await todayMeal(API_URL);

    if (mealinfo[1] == undefined) {
        mealinfo[1] = ['석식', '급식 없음']
    }

    if (ftime == 0) {
        ftime = 1;
        document.getElementById("mealtext").innerHTML =
            mealinfo[mealType][1];
        document.getElementById("mealTime").innerHTML =
            mealinfo[mealType][0];
    } else {
        if (n == 0) {
            document.getElementById("mealtext").innerHTML =
                mealinfo[mealType][1];
        } else {
            if (n == '중식') {
                mealType = 1
            } else {
                mealType = 0
            }
            document.getElementById("mealtext").innerHTML =
                mealinfo[mealType][1];
            document.getElementById("mealTime").innerHTML =
                mealinfo[mealType][0];
        }
    }
}

function syncdate() {
    today = new Date();
    year = today.getFullYear();
    month = String(today.getMonth() + 1).padStart(2, '0');
    day = String(today.getDate()).padStart(2, '0');

    date = year + '-' + month + '-' + day
    document.getElementById("inputdate").value = date;
}

async function apply_meal(n) {
    DATE = document.getElementById("inputdate").value.replace(/-/g, '');

    API_URL = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${APIKey}&Type=json&ATPT_OFCDC_SC_CODE=${AOSC}&SD_SCHUL_CODE=${SSC}&MLSV_FROM_YMD=${DATE}&MLSV_TO_YMD=${DATE}`;

    dayOfWeek = new Date(document.getElementById("inputdate").value).getDay();

    if ((week[dayOfWeek] == '토') || (week[dayOfWeek] == '일')) {
        document.getElementById("mealtext").innerHTML = '주말입니다';
    }

    else {
        await syncMeal(API_URL, n);
    }
}

syncdate()
apply_meal()