/**
 * @version v1.0
 * @ClassNmae: config
 * @Description: desc
 * @Author: SYANNPE
 */

const config = {
    debug: {
        log: true,
    }
}

if (!config.debug.log) {
    console.log = function () {
    };
}

