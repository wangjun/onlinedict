var Options =
{
    "background_color": ["color", ""],
    "links_color": ["color", ""],
    //"text_color": ["color", ""],
    "dict_disable": ["checked", false],
    "ctrl_only": ["checked", false],
    "english_only": ["checked", false]
};

function save_options()
{
    for (key in Options)
    {
        switch (Options[key][0])
        {
        case "color":
            Options[key][1] = "#" + document.getElementById(key).value;
            break;
        case "checked":
            Options[key][1] = document.getElementById(key).checked;
            break;
        }

    }
    localStorage["ColorOptions"] = JSON.stringify(Options);
    var status = document.getElementById("save_status");
    status.innerHTML = "Options Saved.";
}

function restore_options()
{
    var localOptions = JSON.parse(localStorage["ColorOptions"]);
    //alert(localStorage["ColorOptions"]);
    for (key in localOptions)
    {
        optionValue = localOptions[key];
        if (!optionValue) return;
        else
        {
            var element = document.getElementById(key);
            if (element)
            {
                element.value = localOptions[key][1];
                switch (localOptions[key][0])
                {
                case "checked":
                    if (localOptions[key][1]) element.checked = true;
                    else element.checked = false;
                    break;
                }
            } else return;
        }
    }
}