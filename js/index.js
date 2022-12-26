const char = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
number = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
useChar = document.querySelector("#alphabet"),
submit = document.querySelector("body > div > div.options > button"),
len = document.querySelector("body > div > div.options > input"),
resultText = document.querySelector(".result-text")

let result = ""
let isExecutedBefore = false

submit.addEventListener("click", function() {
    // console.log("hi")

    if (isExecutedBefore) {
        result = ""
        isExecutedBefore = false
    }

    if (useChar.checked) {
        result = char[Math.floor(Math.random() * char.length)]
        console.log(result)
    }

    for (let i = 0; i < Math.abs(len.value); i++) {
        result += number[Math.floor(Math.random() * number.length)]
    }

    isExecutedBefore = true

    if (!result) {
        resultText.innerText = `생성 결과 : 오류`
        alert(`설정값이 올바르지 않아 아무 비밀번호도 생성되지 않았습니다`)
        return
    }

    if (document.querySelector("#clipboard").checked) {
        if (window.confirm(`생성한 결과를 클립보드에 저장하시겠습니까?`)) {
            navigator.clipboard.writeText(result)
            .then(() => {
                alert("성공적으로 복사했습니다.")
            })
            .catch((error) => {
                alert(`실패했습니다. 수동으로 복사해주세요.`)
                console.error(error)
            })
        }
    }

    resultText.innerText = `생성 결과 : ${result}`
})