// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// [[[[[[[[[[[[[[[      ]]]]]]]]]]]]]]] █▀▀▀▀▀█ ▄█ ▄▄█▀▄█ █▀▀▀▀▀█
// [:::::[                      ]:::::] █ ███ █ ▄█▀█▄ ▄▀  █ ███ █
// [:::::[                      ]:::::] █ ▀▀▀ █ ▄ █ ▀  ▄▀ █ ▀▀▀ █
// [:::::[                      ]:::::] ▀▀▀▀▀▀▀ ▀ ▀ ▀ ▀ ▀ ▀▀▀▀▀▀▀
// [:::::[                      ]:::::] ▀█▀██▄▀▀▀█▀█▀▀▀ █▀ █ ▀▄▀ 
// [:::::[ CODED BY MrAbdelaziz ]:::::] ▄  ▀  ▀ ▄█▄▄ ▀██▀▄█▄█ ▀▀█
// [:::::[ Github:MrAbdelaziz   ]:::::] ▄█▄█ ▀▀ ▀▀▄█▀█▀▀▄▀▀ ▀ ▀▀ 
// [:::::[                      ]:::::] █ █▄ ▀▀▄▀▄ ▄▄ ██▄ ▀ ▀  ██
// [:::::[                      ]:::::] ▀ ▀▀▀▀▀▀█▀▄▄▀▀▀▄█▀▀▀██▀▀▀
// [:::::[                      ]:::::] █▀▀▀▀▀█ ▀▀█▄▀ ▄ █ ▀ █  ▀█
// [:::::[                      ]:::::] █ ███ █ █▀▀███▀▀▀██▀████▄
// [:::::[                      ]:::::] █ ▀▀▀ █ ██▄ ▀ ▄▄▄▄▄█ ▀  █
// [[[[[[[[[[[[[[[      ]]]]]]]]]]]]]]] ▀▀▀▀▀▀▀ ▀▀ ▀▀▀▀   ▀  ▀▀▀▀

var x = $x;
var alerts = 0;
var condition = "";
var Finder = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitUntil(e) {

    while (Finder) {
        if (x(e).length > 0) {
            Finder = false;
        } else {
            await sleep(2000);
        }
    }

    return true;
}

async function waitUntilAlertIsFired() {

    alerts += 1

    while (Finder) {

        let current_alerts = await currentAlertsCount();
        console.log(`current_alerts: ${current_alerts} -  old ${alerts}`)
        if (alerts == current_alerts) {

            Finder = false;

        } else {

            await sleep(2000);
        }
    }

    return true;
}


async function currentAlertsCount() {
    try {

        Finder = true;

        let currentAlerts = 0;


        try {
            currentAlerts = parseInt(x('//div[contains(@style,"--counter-indicator-value")]//div[1]')[0].textContent)
        } catch (error) {
            currentAlerts = 0
        }

        return currentAlerts;
    }
    catch (error) {
        console.log("Don't forget to Open Alerts SideBar !");
        console.log(error);
    }
}

async function addAlert() {

    alerts = await currentAlertsCount();

    try {

        Finder = true;

        if (await waitUntil("//div[contains(@class,'itemContent')]/span")) {
            condition = x("//div[contains(@class,'itemContent')]/span")[0].innerText.trim()
        }

        console.log(`using ${condition} as condition `)

    } catch (error) {
        console.log("can't detect the condition, try to select the correct indicator/strategy");
        console.log(error);
    }


    try {

        Finder = true;

        if (await waitUntil('//button[contains(@data-name,"submit")]')) {
            x('//button[contains(@data-name,"submit")]')[0].click()
        }

        Finder = true;

        if (await waitUntilAlertIsFired()) {
            AddScrennerAlerts()
        }

    } catch (error) {
        console.log('cant Add Current');
        console.log(error);
    }


}


async function AddScrennerAlerts() {

    try {

        var screenerItems = x('//tr[contains(@class,"tv-screener-table__result-row--selected") and not(contains(@class,"tv-screener-table__result-row--active"))]//span[contains(@class,"tv-screener__description")]')

        if (screenerItems.length > 0) {

                for (let index = 0; index < screenerItems.length; index++) {
                    const item = screenerItems[index];
                    
                    try {
                        let item_text = item.textContent.trim();

                        item.click()

                        await sleep(5000);

                        Finder = true;
    
                        if (waitUntil('//div[contains(@data-name,"legend-source-title") and contains(text(), "' + item_text + '")]')) {
    
                        Finder = true;


                            let res = await waitUntil('//*[@id="header-toolbar-alerts"]');

                            console.log("clicking alert button")

                            if (res) {
                                x('//*[@id="header-toolbar-alerts"]')[0].click()
                            }
                            
                            await sleep(2000);

                            console.log("waiting list ")

                            Finder = true;
    
                             res = await waitUntil("//div[contains(@class,'select-')]/span");

                            if (res) {
                                x("//div[contains(@class,'select-')]/span")[0].click()
                            }

                            await sleep(2000);

                            console.log("waiting condition ")

                            Finder = true;

                            res = await waitUntil('//div[contains(@data-name,"menu-inner")]//span[contains(text(), "' + condition + '")]');

                            if (res) {
                                x('//div[contains(@data-name,"menu-inner")]//span[contains(text(), "' + condition + '")]')[0].parentElement.click()
                            }
                            
                            await sleep(2000);

                            console.log("click  submit ")

                            Finder = true;
                            res = await waitUntil('//button[contains(@data-name,"submit")]');

                            if (res) {
                                x('//button[contains(@data-name,"submit")]')[0].click()
                            }
    
                            Finder = true;
                            
                            await sleep(2000);

                            console.log("waiting  creation ")

                            res = await waitUntilAlertIsFired();

                            if (res) {
                                console.log("waiting Alert to be created")
                            }

                            await sleep(3000);
    
                        }

                    } 
                    catch (error)
                     {
                        console.log(error)
                    }



                }





        }
        else {
            alert("No Screener Items Selected !")
        }

    } catch (error) {
        console.log(error)
    }
}


try {

    var buttons = x("//div[contains(@data-outside-boundary-for,'alerts-create-edit-dialog')]//div[contains(@class,'buttons')]")[0]
    var button_class = x("//div[contains(@data-outside-boundary-for,'alerts-create-edit-dialog')]//div[contains(@class,'buttons')]//button")[0]
    button_class = $(button_class).attr("class");

    const LeftDiv = document.createElement("div");
    LeftDiv.className = "leftSlot";
    LeftDiv.innerHTML = '<button style="background-color: #2962ff;" id="addAlert" class="' + button_class + '" type="button"><span class="content" style="background-color: #2962ff;color: white;">Screener Alert</span></button>';
    LeftDiv.style = "margin-inline:auto";
    buttons.appendChild(LeftDiv);

    document.getElementById("addAlert").addEventListener("click", addAlert);

} catch (error) {
    console.log('Please open Alert page before executing this command !');
    console.log(error);
}
