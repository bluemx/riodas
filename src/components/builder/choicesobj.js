var json = {
    "title": "Title",
    "clock": true,
    "countdown": 0,
    "noattempts": true,
    "intro": {
        "buttons": {
            "start": "Start"
        },
        "content": []
    },
    "activity": {
        "scenes": [
            {
                "block": "scene",
                "name": "SC1",
                "countdown": 0,
                "instructions": {
                    "open": true,
                    "content": [
                        {
                            "block": "group",
                            "class": "flex gap-2 items-center",
                            "content": [
                                {
                                    "block": "text",
                                    "class": "",
                                    "text": "Instructions...",
                                    "name": "xIwU"
                                }
                            ],
                            "background": "",
                            "name": "lgeG"
                        }
                    ]
                },
                "content": [
                    {
                        "class": "flex flex-col gap-10 my-10 max-w-3xl mx-auto",
                        "content": [],
                        "block": "group",
                        "name": "questions"
                    },
                    {
                        "symbol": "FinalizeGroup"
                    }
                ]
            }
        ]
    },
    "end": {
        "buttons": {
            "restart": false
        },
        "content": [
            {
                "symbol": "finishedAll"
            }
        ]
    },
    "symbols": {
        "finishedAll": {
            "class": "w-full",
            "content": [
                {
                    "block": "group",
                    "class": "bg-slate-100 rounded p-5 text-center w-full",
                    "content": [
                        {
                            "block": "text",
                            "text": "Congratulations, you finished the activity.",
                            "class": "",
                            "name": "Congra"
                        }
                    ],
                    "background": "",
                    "name": "CongraGroup"
                },
                {
                    "block": "group",
                    "class": "text-center p-5",
                    "content": [
                        {
                            "block": "finished",
                            "name": "finishedBlock"
                        }
                    ],
                    "background": "",
                    "name": "finishedGroup"
                }
            ],
            "background": "",
            "block": "group"
        },
        "FinalizeGroup": {
            "block": "group",
            "class": "text-center mt-10",
            "content": [
                {
                    "block": "button",
                    "class": "mx-auto",
                    "to": "/end",
                    "text": "Finalize",
                    "name": "FinalizeBTN"
                }
            ],
            "background": ""
        }
    }
}

export default { json }