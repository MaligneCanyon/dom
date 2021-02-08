// algo:
// - gen a list of li cmds
// - if not all cmds are supported
//   - for each li
//     - set the li textContent
// - else
//   - use the FA icons
// - if an li is clicked
//   - exec the li cmd

document.addEventListener('DOMContentLoaded', event => {
  const navUl = document.querySelector('nav > ul');
  const navLiArr = Array.from(navUl.getElementsByTagName('li'));
  const alignmentIcons = navLiArr.slice(-4);
  const listIcons = navLiArr.slice(5, 7);

  const div = document.querySelector('div');
  document.addEventListener('keydown', event => {
    // console.log(event.key);

    // the Enter key spawns a new <div> inside the old one by default,
    // except when pressed inside a user-inserted <ul> or <ol>
    let listIconActive = document.queryCommandState("insertUnorderedList") ||
      document.queryCommandState("insertOrderedList");
    // console.log({listIconActive})
    if (event.key === 'Enter' && !listIconActive) {
      event.preventDefault();

      // document.execCommand('insertBrOnReturn'); // doesn't work

      // the following adds a space(?), not a newline, and the cursor moves
      // (undesirably) to the start of the oldline
      // div.append('\r\n');
      // div.textContent += '\r\n';

      // ... this has the same problem
      // let str = div.textContent + '\r\n';
      // div.firstChild.remove();
      // div.append(str);

      // at least this adds a newline; however, the cursor doesn't move to it
      // const br = document.createElement('br');
      // div.appendChild(br);

      // inserting a single <br> on its own doesn't work properly
      // document.execCommand('insertHTML', false, '<br>');

      // the following works but (usually) inserts an extra blank line ...
      document.execCommand('insertHTML', false, '<br><br>');
    } else if (event.key === 'Backspace' && !div.textContent) {
      event.preventDefault(); // disable Backspace key if <div> is empty
      div.lastChild.remove(); // (if any exist) remove a <br>
    }
  });

  // for curiousity's sake ...
  // console.log(document.querySelector('div').getAttribute('contenteditable')); //=> 'true'
  // const liCmds = navLiArr.map(li => getCmd(li));
  // console.log(liCmds);
  // console.log(liCmds.every(cmd => document.queryCommandSupported(cmd))); //=> should be T

  // alt to using FA icons ...
  // navLiArr.forEach((li, ndx) => {
  //   let text =
  //     Object.keys(CMDS)[ndx].slice(3).split('-').map(cmdSegment => cmdSegment[0]).join('').toUpperCase();
  //   li.append(text); // B, I, U, S, L, LU, LO, AL, AR, AC, or AJ
  //   // console.log(text);
  // });

  navUl.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    let cmd;
    let result = false;
    let counter = 0;
    let link;
    let url = null;
    let alignmentIconTargeted;

    if (target.nodeName === 'LI') {
      // invoking document.execCommand() doesn't always work; must chk its rtn
      // value (a T result toggles the state of the cmd, ex. turns bold on/off,
      // a F result does nothing) before toggling the 'pressed' class

      // Note: clicking an alignment icon also spawns a new div, so don't run
      // the cmd; instead just add the appropriate value for the 'align' attrib
      // to the current <div>
      alignmentIconTargeted = target.className.includes('fa-align');
      if (alignmentIconTargeted) {
        cmd = target.className.split(' ')[1].slice(9); // 'left', 'right', 'center' or 'justify'
        div.setAttribute('align', cmd);
        result = div.getAttribute('align') === cmd;
        counter++;
      } else {
        cmd = getCmd(target);
        link = target.classList.contains('fa-link');
        if (link) url = prompt('Enter the URL to link to:');
        while (!result && counter < 1000) {
          result = (link && url) ? document.execCommand(cmd, false, url) : document.execCommand(cmd);
          counter++;
        }
      }

      if (result) { // cmd succeeded
        if (link) // the link icon was clicked
          ; // do nothing; the 'link' icon never remains in a pressed state
        else if (target.className.includes('fa-list')) { // a list icon was clicked
          processIcons(listIcons, target);
        } else if (alignmentIconTargeted) { // an alignment icon was clicked
          processIcons(alignmentIcons, target);
        } else target.classList.toggle('pressed'); // one of the other icons was clicked
      }
      console.log(`'${cmd}' ${result ? 'success' : 'failure'} in ${counter} attempt(s)`);
      console.log(target.classList);
    }
  });
});

function processIcons(group, target) {
  // only 0 or 1 icon in a group of icons can be pressed at any given time
  group.forEach(icon => {
    if (icon === target) icon.classList.toggle('pressed');
    else icon.classList.remove('pressed');
  });
}

const CMDS = { // could use a data-cmd attrib instead
  "fa-bold": "bold",
  "fa-italic": "italic",
  "fa-underline": "underline",
  "fa-strikethrough": "strikeThrough",
  "fa-link": "createLink", // URI req'd ?
  "fa-list-ul": "insertUnorderedList", // removes too ?
  "fa-list-ol": "insertOrderedList", // removes too ?
  "fa-align-left": "justifyLeft",
  "fa-align-right": "justifyRight",
  "fa-align-center": "justifyCenter",
  "fa-align-justify": "justifyFull",
}

function getCmd(elem) {
  let cmd = null;

  elem.className.split(' ').forEach(name => {
    if (name.startsWith('fa-')) cmd = CMDS[name];
  });

  return cmd;
}
