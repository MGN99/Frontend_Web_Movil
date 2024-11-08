import { IP_ADDRESS, PORT_MS_AUTH, PORT_MS_IAM, PORT_MS_QUESTIONNAIRE } from "@env"

export const URL_AUTH=`http://${IP_ADDRESS}:${PORT_MS_AUTH}`

export const SIGNIN_ENDOPOINT = "/auth/signin"

export const CHECK_ACCES_TOKEN_ENDPOINT="/auth/check-access-token"

export const RENEW_ACCESS_TOKEN_ENDPOINT = "/auth/renew-access-token"


export const URL_MSIAM = `http://${IP_ADDRESS}:${PORT_MS_IAM}`
export const MACHINES_AREA_ENDPOINT = '/machine/machines/area'


export const MS_QUESTIONNAIRE_URL = `http://${IP_ADDRESS}:${PORT_MS_QUESTIONNAIRE}`;

export const QUESTIONNAIRE_ENDPOINT = "/questionnaire/";