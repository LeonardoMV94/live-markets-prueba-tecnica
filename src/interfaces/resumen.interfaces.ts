export interface ResumenResponse {
    success: boolean;
    code:    number;
    data:    Data;
}

export interface Data {
    info:  Info;
    price: Price;
}

export interface Info {
    name:           string;
    shortName:      string;
    countryName:    string;
    currencyName:   string;
    currencySymbol: string;
    codeInstrument: string;
    marketName:     string;
    hourOpen:       string;
    hourClose:      string;
    trading:        boolean;
    exchangeRate:   number;
}

export interface Price {
    lastPrice:                   number;
    datetimeLastPrice:           string;
    openPrice:                   number;
    closePrice:                  number;
    datetimeClosePrice:          string;
    performanceAbsolute:         number;
    performanceRelative:         number;
    bid:                         number;
    bidVolume:                   number;
    bidDatetime:                 Date;
    ask:                         number;
    askVolume:                   number;
    askDatetime:                 Date;
    volumeMoney:                 number;
    accumulatedVolumeMoney:      number;
    volumeInstrument:            number;
    accumulatedVolumeInstrument: number;
    tend:                        string;
    maxDay:                      number;
    minDay:                      number;
    min52W:                      number;
    max52W:                      number;
    pct30D:                      number;
    pctRelW52:                   number;
    pctRelCY:                    number;
}
