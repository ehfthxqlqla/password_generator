const char = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
number = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
useChar = document.querySelector("#alphabet"),
submit = document.querySelector("body > div > div.options > button"),
len = document.querySelector("body > div > div.options > input"),
resultText = document.querySelector(".result-text"),
resultInput = document.querySelector(".result-input"),
lastpwInput = document.querySelector(".last-password"),sha256 = (ascii) => {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
            
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
},
entrancePassword = "c06b0cfe0cc5e900c57784484094331f095bf441995c3c31ea6c75691c786c35"

window.onload = () => {
    const prompt = window.prompt("비밀번호를 입력하세요.")

    if ( !(sha256(prompt) == entrancePassword) ) {
        alert(`비밀번호가 맞지 않습니다.`)
        window.location.reload()
    } else if (prompt === null) {
        alert(`비밀번호를 입력해 주세요!`)
        window.location.reload()
    }
}

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
