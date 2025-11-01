import * as pg from "pg";


const config = {
    user: "avnadmin",
    password: "AVNS_rUbrnucEU3vny2wPOb3",
    host: "pg-1d9a31e-shvgpt070208-2249.e.aivencloud.com",
    port: 13433,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUW8U4D68wKLxyRMX07eIS33QkipQwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1NGNkOTNhOWQtNTE4My00YmUzLTg2NWEtMjQwOGNiNGMw
NzdjIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUxMDAzMTYwMjQ4WhcNMzUxMDAxMTYw
MjQ4WjBAMT4wPAYDVQQDDDU0Y2Q5M2E5ZC01MTgzLTRiZTMtODY1YS0yNDA4Y2I0
YzA3N2MgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAI1XwMfKgjGsGwE+Uo9Oq40dWfL8sjlyUwazHBJKTamK4p+Ez4BsJndL
WN5zsafte0AT40sXS2uBqS2RqD9O42uC5eHDJm0miKVTqOs4wEC37izyrwys20pn
/yU4k8CJWA7S9yply6jNKRe7WFXQBPKMnSxw+n8tMIJX/clW2qyZgisINFaj+SZk
27p6BMJxV5UFmKNZPes1N9saDsW02gKDLJT4osN05j24NOGnYCxmAF0xQGcDFggY
G1BkiTA88fPQytIkYS5ly0vweFApm7z5mxG0QM13xSBOqcd/efG7FCFVf6vR0mdw
FQakBolUUlt2GjBs1iIjA6UYwHgeoSyr5mSJMjZ0P76+CGjT8/50IFO5UqKAXRYk
hVabdpV7eYoMhAmMV6EuK9jV01rjhV6aXxxsu5h+Gei/vrkOl682QNgQVw+Gw/Kg
doLiSh+WmUswmh+xU+3EZQS8fqCyV84++DGTgQJykM7kiQr5TZ3x+t17/vi/rk2X
MGbkOIPF5wIDAQABo0IwQDAdBgNVHQ4EFgQUtt9u2gWYAwPs6zC6dGWkhwJzuWIw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBABnSVLPIM02/fi15E85EMgezrd2pNmriuldxxRJ29iySdpdKlUEhRLOkvvS3
9hhzdine2DHjGSqF7zuhLHQ6p1olzVlY/ad6qYcjrlQ/7b91vyzLlMP6oGaYG52A
GIIp6QhEWMXzBBtiAP7dbU7tnpbO0AWxgO6KWNdtuquDnSphSv5VzjVrbJZY/T4g
soxcJx2dMtyTdkwfF6n1TAJnDDrYscCoTvpqpksZGkYa2UODySSJ/qnCC5vbBScn
LyTaLG7O52Srkp5OqW4eskC8rzDKH0GIVZDbNvY+qqotJg/mXLe/xv9kMXX2rCEy
cQh/suwOEjhED0L29H2tSdFeMwJnmc32hEI2O5l0a3AX41+m4cuaVCbM9pzP80GN
FS5mjU+7odOiGt5pGxSUyh6/Hj/4js9M9BacB5itRXNuJznQTUi4bPY7Jqh97+2h
kqH5gcf/0HptbE6i+HtTUIdcJFcuL74LT3BEdhtiEJDZpGkUHkGck0ikC0LOg095
6+VInw==
-----END CERTIFICATE-----`,
    },
};

export const client = new pg.Client(config);
client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});