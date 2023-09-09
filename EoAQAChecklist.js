(function () {
    'use strict';
    let list, listItems;

    document.querySelector('#left-nav > div.nav-bar-bottom').style.display =
        'none'; // remove show/hide sidebar button

    const qaMenu = document.querySelector('#left-nav > ul.nav.nav-sidebar.cpk'); // get campaign check button and convert it
    list =
        '<li><a href="#"><i class="left-nav-icons icon-phobos-plane" title="QA Checklist"></i><span title="QA Checklist">QA Checklist</span></a>'; // create list HTML
    qaMenu.innerHTML = list; // inject list HTML

    function showBytes(size, decimals = 2) {
        // show proper size unit, depending on size
        if (size === 0) return '0 Bytes';
        const kilo = 1024,
            d = decimals < 0 ? 0 : decimals,
            units = ['Bytes', 'KB', 'MB'],
            i = Math.floor(Math.log(size) / Math.log(kilo));

        return (
            parseFloat((size / Math.pow(kilo, i)).toFixed(d)) + ' ' + units[i]
        );
    }

    function showSize(e) {
        // get copied data via clipboard API
        const clipboardData = e.clipboardData || window.clipboardData,
            copiedData = clipboardData.getData('Text'),
            input = document.querySelector(
                '#left-nav > ul.nav.nav-sidebar.cpk > li > a > span'
            ), // get EoA input area
            fileSize = copiedData.length; // get filesize via character count
        input.innerHTML = 'QA Checklist<br>File size: ' + showBytes(fileSize); // inject title + file size

        // append success/fail icon, according to Gmail truncate limit (102KB)
        if (fileSize < 104448) {
            input.innerHTML += ' &#9989;';
        } else {
            input.innerHTML += ' &#10060;';
        }
    }

    function showUI() {
        listItems = listItems.split('\\n'); // split on newlines
        list += '<ul class="nav nav-sidebar qam-subitems">'; // create list
        for (let i = 0; i < listItems.length; i++) {
            // add items
            list +=
                '<li><label><input type="checkbox"> <span>' +
                listItems[i] +
                '</span></label></li>';
        }
        list += '</ul></li>';

        qaMenu.innerHTML = list; // inject list HTML

        const inputBox = document.querySelector(
            '#manualForm > div:nth-child(3) > div:nth-child(2) > div.tab-content.radio-tab-content'
        );

        if (inputBox) {
            inputBox.addEventListener('paste', showSize); // listen for paste and get/show file size
        }

        const qaItems = document.querySelector('.qam-subitems'),
            labels = document.querySelectorAll(
                '#left-nav > ul.nav.nav-sidebar.cpk label'
            ),
            innerUl = document.querySelector(
                '#left-nav > ul.nav.nav-sidebar.cpk > li > ul'
            );
        qaItems.style.cssText =
            'font-size: 13px; margin: 0 10px; width: 200px; display: none;'; // style list items

        for (let i = 0; i < labels.length; i++) {
            labels[i].style.cssText = 'color: #fff; font-weight: normal;'; // style list text
        }

        qaMenu.addEventListener('click', function () {
            // make show/hide list on click
            this.classList.toggle('active');
            if (qaItems.style.display === 'block') {
                qaItems.style.display = 'none';
            } else {
                qaItems.style.display = 'block';
            }
        });

        innerUl.style.userSelect = 'none'; // prevent text selection for list items
        innerUl.addEventListener('click', function (e) {
            // prevent menu hiding when clicking on list items
            e.stopPropagation();
        });
    }

    // Google Sheets API
    const spreadsheetId = '1PmD3u7Vwi_F8C5kDVZ3Co0jj6ZVxs_3g7Fir56xAAvo';
    fetch(
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`
    )
        .then((res) => res.text())
        .then((text) => {
            listItems = JSON.parse(text.substr(47).slice(0, -2));
            listItems = listItems.table.rows[0].c[0].v;
        })
        .then(() => showUI());
})();
