import React from 'react';


import './Popup.css';

import { useEffect, useState } from 'react';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another


const Popup = () => {

  const [diff, setDiff] = useState({})
  const [error, setError] = useState({})
  const [mismatchLine, setMisMatchLine] = useState([])
  const [isCompareClicked, setCompareClicked] = useState(false)
  const [code1, setCode1] = React.useState(
    ``
  );
  const [code2, setCode2] = React.useState(
    ``
  );

  var line = 1
  var lines = []
  var compareObj = function (obj1, obj2) {

    var ret = {}, rett;
    for (var i in obj2) {
      line = line + 1;
      rett = {};
      line
      if (typeof obj2[i] === 'object') {
        console.log(typeof obj2[i],)
        rett = compareObj(obj1[i], obj2[i]);
        if (Object.keys(rett).length > 0) {
          ret[i] = rett
          // lines.push(line)
          // console.log("mismatch at line", line)
        }
      } else {
        if (!obj1 || !obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
          ret[i] = obj2[i];
          lines.push(line)
          console.log("mismatch at line", line)
        }
      }
    }
    setMisMatchLine(lines)
    return ret;
  };




  const compareData = () => {
    setError({})

    try {
      let obj1 = JSON.parse(code1)

      try {
        let obj2 = JSON.parse(code2)
        let d = compareObj(obj1, obj2)

        console.log(d)
        setDiff(d)
        setCompareClicked(true)
      } catch (err2) {
        console.log("GOT SYNTAX EDITOR 2", err2.message)
        setError({
          message: err2.message,
          editor: "2"
        })
      }

    } catch (err1) {
      console.log("GOT SYNTAX EDITOR 1", err1.message)
      setError({
        message: err1.message,
        editor: "1"
      })
    }





  }
  const hightlightWithLineNumbers = (input, language) => {
    return highlight(input, language)
      .split("\n")
      .map((line, i) => {
        console.log(mismatchLine.includes(i - 1), mismatchLine, i)
        return `<span class='${mismatchLine.includes(i + 1) ? 'editorLineNumber errorHighLight' : 'editorLineNumber'}'>${i + 1}</span>${line}`
      })
      .join("\n");
  }




  return (
    <div id="app-view">

      <span id="app-title">JSON COMPARE</span>


      <Editor
        value={code1}
        onValueChange={code => setCode1(code)}
        highlight={code => hightlightWithLineNumbers(code1, languages.js)}
        padding={10}
        textareaId="codeArea1"
        className={error.editor == "1" ? "editor errorHighLight" : "editor"}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          outline: 0
        }}
      />
      <Editor
        value={code2}
        onValueChange={code => setCode2(code)}
        highlight={code => hightlightWithLineNumbers(code2, languages.js)}
        padding={10}
        textareaId="codeArea2"
        className={error.editor == "2" ? "editor errorHighLight" : "editor"}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          outline: 0
        }}
      />

      {error.message &&
        <div id="error-box">
          <span id="error-message">{error.message}</span>
        </div>
      }
      {(isCompareClicked && Object.keys(diff).length == 0) &&
        <div id="success-box">
          <span id="error-message">JSON data is same</span>
        </div>
      }
      {(isCompareClicked && Object.keys(diff).length > 0) &&
        <div id="error-box">
          <span id="error-message">Found Mismatch in data</span>
        </div>
      }

      <div>
        <button id="compare-btn" onClick={compareData}>COMPARE</button>
      </div>

      {/* <div>
        <span>{JSON.stringify(diff)}</span>
      </div> */}
      <footer id="footer">
        Product by <b>@Codified Coder</b>
      </footer>
    </div>
  );
};

export default Popup;
