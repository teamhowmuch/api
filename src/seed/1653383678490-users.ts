import { MigrationInterface, QueryRunner } from 'typeorm'

export class users1653383678490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    INSERT INTO
    public."user" (
        email,
        active,
        created_at,
        updated_at,
        onboarding_data,
        name
    )
SELECT
    'jjveltman@gmail.com',
    true,
    '2022-04-26 13:54:45.474681',
    '2022-04-26 13:55:06.729837',
    '{"completed_at":"2022-04-26T13:55:05.706Z"}',
    'Job Veltman'
WHERE
    NOT EXISTS(
        SELECT
            id
        FROM
            "user"
        WHERE
            email = 'jjveltman@gmail.com'
    );

INSERT INTO
    public.user_bank_connection (
        provider,
        requisition_data,
        created_at,
        updated_at,
        requisition_status,
        requisition_expires_at,
        account_details_data,
        bank_id,
        user_id
    )
VALUES
    (
        'nordigen',
        '{ "id": "b3bb941f-922e-42c5-93f0-06245f34b542",
        "ssn": null,
        "link": "https://ob.nordigen.com/psd2/start/b3bb941f-922e-42c5-93f0-06245f34b542/RABOBANK_RABONL2U",
        "status": "LN",
        "created": "2022-04-26T13:55:22.719720Z",
        "accounts": ["5f3f968b-2844-44c9-b65f-7e9e064a3a25"],
        "redirect": "exp://192.168.178.20:19000",
        "agreement": "c3799000-522d-42e9-b19c-8348a2203745",
        "reference": "8e175920-513e-492d-8130-22e0fc00c91e",
        "user_language": "nl",
        "institution_id": "RABOBANK_RABONL2U",
        "account_selection": false,
        "redirect_immediate": false }',
        '2022-04-26 13:55:22.749951',
        '2022-04-26 14:02:42.086046',
        'valid',
        '2022-05-10 14:02:41.315',
        '[{"iban": "NL15RABO0142175013", "status": "enabled", "currency": "EUR", "ownerName": "J.J. Veltman", "nordigenId": "5f3f968b-2844-44c9-b65f-7e9e064a3a25", "resourceId": "1tEkA8q2YoN341z5c-vDhPnbj8S3B0OhLLsSn59SfZcagRJRlrWLts2zKuYM3PH-"}]',
        'RABOBANK_RABONL2U',
        (
            SELECT
                id
            FROM
                "user"
            WHERE
                email = 'jjveltman@gmail.com'
        )
    );

    INSERT INTO
    emission_event (
        co2eq_mean,
        source_type,
        source_id,
        data,
        timestamp,
        created_at,
        updated_at,
        user_id
    )
VALUES
    (
        59.858635,
        'TRANSACTION',
        '4992ba47453c97ac442535386e3b7989f7ab54fb342026c87d7e3478079489b4',
        '{"transaction_type":"carfuel","transaction_amount":45.41,"carfuel_type":"PETROL","carfuel_amount":21.50094696969697,"carfuel_price":2.112,"merchant":{"name":"Shell","searchPattern":"shell","category":"carfuel","iconUrl":"https://1000logos.net/wp-content/uploads/2017/06/Shell-Logo.png"}}                ',
        '2022-05-07 00:00:00+00',
        '2022-05-10 14:33:04.938708',
        '2022-05-10 14:33:04.938708',
        (
            SELECT
                id
            FROM
                "user"
            WHERE
                email = 'jjveltman@gmail.com'
        )
    ),
    (
        67.57,
        'TRANSACTION',
        '5500708e8fe7cdde5de1af6bca2bbf992638e8e045d7b6f33a0a3068c45e67e3',
        '{"transaction_type":"carfuel","transaction_amount":51.26,"carfuel_type":"PETROL","carfuel_amount":24.270833333333332,"carfuel_price":2.112,"merchant":{"name":"Total","searchPattern":"total","category":"carfuel","iconUrl":"https://www.tariefcoach.nl/upload/pdf/2018/07/Total-logo-1024x768.png"}}         ',
        '2022-05-07 00:00:00+00',
        '2022-05-10 14:33:05.083583',
        '2022-05-10 14:33:05.083583',
        (
            SELECT
                id
            FROM
                "user"
            WHERE
                email = 'jjveltman@gmail.com'
        )
    ),
    (
        73.95745,
        'TRANSACTION',
        '6b0413d4270b19044324cfc74ceba53f7f3b4372bdbc82615ff4dfec51610fbc',
        '{"transaction_type":"carfuel","transaction_amount":55.84,"carfuel_type":"PETROL","carfuel_amount":26.5651760228354,"carfuel_price":2.102,"merchant":{"name":"Tamoil","searchPattern":"tamoil","category":"carfuel","iconUrl":"https://tamoil.nl/wp-content/uploads/2017/10/Tamoil-logo-hoge-resolutie.jpg"}}   ',
        '2022-04-06 00:00:00+00',
        '2022-05-10 14:33:05.867903',
        '2022-05-10 14:33:05.867903',
        (
            SELECT
                id
            FROM
                "user"
            WHERE
                email = 'jjveltman@gmail.com'
        )
    ),
    (
        4.111644,
        'TRANSACTION',
        'aafe27af935487f1e39838f434c215b9c2f04c8432e8addddb8f31021780822b',
        '{"transaction_type":"carfuel","transaction_amount":3.45,"carfuel_type":"PETROL","carfuel_amount":1.4768835616438358,"carfuel_price":2.336,"merchant":{"name":"BP","searchPattern":"bp ","category":"carfuel","iconUrl":"https://1000logos.net/wp-content/uploads/2016/10/BP-Logo-1024x640.png"}}               ',
        '2022-03-14 00:00:00+00',
        '2022-05-10 14:33:06.331533',
        '2022-05-10 14:33:06.331533',
        (
            SELECT
                id
            FROM
                "user"
            WHERE
                email = 'jjveltman@gmail.com'
        )
    ),
    (
        91.287346,
        'TRANSACTION',
        'df164bdc2d77b231d24dcc9a1a901c303a1554496e9e8407ce7b07ec1b68c086',
        '{"transaction_type":"carfuel","transaction_amount":76.04,"carfuel_type":"PETROL","carfuel_amount":32.78999568779647,"carfuel_price":2.319,"merchant":{"name":"BP","searchPattern":"bp ","category":"carfuel","iconUrl":"https://1000logos.net/wp-content/uploads/2016/10/BP-Logo-1024x640.png"}}               ',
        '2022-03-08 00:00:00+00',
        '2022-05-10 14:33:06.423837',
        '2022-05-10 14:33:06.423837',
        (
            SELECT
                id
            FROM
                "user"
            WHERE
                email = 'jjveltman@gmail.com'
        )
    ),
    (
        9.696183,
        'TRANSACTION',
        'b240189ffec64971a308c05799224f422c078bd1c6ab8c0ce496279a2cf6ccad',
        '{"transaction_type":"carfuel","transaction_amount":7.3,"carfuel_type":"PETROL","carfuel_amount":3.482824427480916,"carfuel_price":2.096,"merchant":{"name":"Shell","searchPattern":"shell","category":"carfuel","iconUrl":"https://1000logos.net/wp-content/uploads/2017/06/Shell-Logo.png"}}                  ',
        '2022-02-27 00:00:00+00',
        '2022-05-10 14:33:06.664715',
        '2022-05-10 14:33:06.664715',
        (
            SELECT
                id
            FROM
                "user"
            WHERE
                email = 'jjveltman@gmail.com'
        )
    ),
    (
        87.602844,
        'TRANSACTION',
        '401533360146ef28ab4eabc9db4f79af99a22e5d03c98a70136332086c4eea3c',
        '{"transaction_type":"carfuel","transaction_amount":66.3,"carfuel_type":"PETROL","carfuel_amount":31.466540104413856,"carfuel_price":2.107,"merchant":{"name":"Avia","searchPattern":"avia ","category":"carfuel","iconUrl":"https://upload.wikimedia.org/wikipedia/commons/c/c0/AVIA_International_logo.svg"}} ',
        '2022-04-30 00:00:00+00',
        '2022-05-12 13:33:48.874662',
        '2022-05-12 13:33:48.874662',
        (
            SELECT
                id
            FROM
                "user"
            WHERE
                email = 'jjveltman@gmail.com'
        )
    ),
    (
        89.38742,
        'TRANSACTION',
        '20170df3e542067db4bfa60b01210f68c63d07d714790d2af86225797756b511',
        '{"transaction_type":"carfuel","transaction_amount":59.11,"carfuel_type":"PETROL","carfuel_amount":32.107550244432375,"carfuel_price":1.841,"merchant":{"name":"BP","searchPattern":"bp ","category":"carfuel","iconUrl":"https://1000logos.net/wp-content/uploads/2016/10/BP-Logo-1024x640.png"}}              ',
        '2021-08-08 00:00:00+00',
        '2022-05-12 13:33:52.693557',
        '2022-05-12 13:33:52.693557',
        (
            SELECT
                id
            FROM
                "user"
            WHERE
                email = 'jjveltman@gmail.com'
        )
    );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`)
  }
}
