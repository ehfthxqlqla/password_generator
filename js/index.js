const char = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
number = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
useChar = document.querySelector("#alphabet"),
submit = document.querySelector("body > div > div.options > button"),
len = document.querySelector("body > div > div.options > input"),
resultText = document.querySelector(".result-text"),
resultInput = document.querySelector(".result-input"),
lastpwInput = document.querySelector(".last-password")

let result = ""
let isExecutedBefore = false

submit.addEventListener("click", function() {
    if (isExecutedBefore) {
        result = ""
        isExecutedBefore = false
    }

    if (useChar.checked) {
        result = char[Math.floor(Math.random() * char.length)]
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

    resultInput.value = `${result}`
    window.localStorage.setItem("pw", result)
    lastpwInput.value = `${window.localStorage.getItem("pw")}`

    if (document.querySelector("#clipboard").checked) {
        if (window.confirm(`생성한 결과를 클립보드에 저장하고 비밀번호를 설정하시겠습니까?`)) {
            navigator.clipboard.writeText(result)
            .then(() => {
                alert("성공적으로 복사했습니다.")
            })
            .catch(() => {
                try {
                    resultInput.select()
                    resultInput.setSelectionRange(0, 100000)
                    document.execCommand("copy")
                    alert(`성공적으로 복사했습니다.`)
                } catch {
                    alert(`실패했습니다.`)
                }
            })
        }

        (async() => {
            await axios.post(`https://api.ehfthxqlqla.repl.co/api/v1/pw/generate`, {
                password:result
            })
            .then(() => {
                alert(`비밀번호 설정이 완료되었습니다.`)
            })
            .catch((error) => {
                alert(`비밀번호 설정에 실패했습니다. 다시 시도해 주세요.`)
            })
        })()
    }
})
