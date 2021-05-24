import React from 'react'

import Header from '../../components/common/header'

import './css/index.css'

export default class DocsTermsPage extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Header previous_page="/" page_name="Пользовательское соглашение"/>
                <div className="docs page">
                    <a href="/docs/terms.docx" download target="_blank" className="docs">Скачать пользовательское соглашение</a>
                    <p>
                    Добро пожаловать на Bustail — сервис объявлений в сфере пассажирских перевозок, который объединяет клиентов и перевозчиков.
                    <br/>Пользовательское соглашение («Соглашение») регулируют отношения между ИП Грищенко Александр Алексеевич ИНН 745116925545 ОГРНИП 320745600035739 («Компания», «мы») и пользователями интернета, которые осуществили доступ к Bustail («пользователи», «вы»).
                    Вы можете использовать Bustail в соответствии с положениями Соглашений и политики конфиденциальности данных Если вы с ними не согласны, вам необходимо прекратить использование Bustail.
                    <br/>1.	Что такое Bustail
                    <br/>Bustail – интернет-сайт, доступный по адресу bustail.online  (включая все уровни домена) через полную и мобильную версии и мобильное приложение, представляющий собой совокупность содержащихся в информационной системе объектов интеллектуальной собственности Компании и информации (административного и пользовательского контента) («Bustail»).
                    Bustail представляет собой электронный каталог объявлений о предложениях аренды транспорта и предложениях поездки (вместе — «предложения»), которые пользователи могут предлагать и искать на Bustail с целью заключения сделок.
                    Компания предоставляет авторизованным пользователям техническую возможность размещать информацию на Bustail в формате объявлений в представленных категориях предложений.
                    Компания предоставляет авторизованным пользователям техническую возможность искать и просматривать объявления на Bustail в целях, предусмотренных Соглашением.
                    Компания не является участником, организатором сделки, покупателем, продавцом, работодателем, посредником, агентом, представителем какого-либо пользователя, выгодоприобретателем или иным заинтересованным лицом в отношении сделок между пользователями. Пользователи используют размещённую на Bustail информацию, чтобы заключать сделки на свой страх и риск без прямого или косвенного участия или контроля со стороны Компании.
                    <br/>2. Регистрация на Bustail
                    <br/>Вы можете зарегистрироваться на Bustail с помощью номера мобильного телефона, электронной почты.
                    После регистрации мы создадим ваш уникальный профиль. Одновременно на Bustail может быть только один профиль, привязанный к одной электронной почте.
                    Регистрируясь на Bustail и при каждом случае входа на Bustail, вы гарантируете, что обладаете всеми правомочиями, необходимыми для заключения и исполнения Соглашений
                    <br/>3. Вход на Bustail
                    <br/>Вы можете войти в свой профиль на Bustail (авторизоваться) с помощью адреса электронной почты, указанных в вашем профиле и указать пароль («данные для входа»)

                    Вы обязаны сохранять конфиденциальность своих данных для входа на Bustail. Если у вас есть основания полагать, что кто-то получил к ним несанкционированный доступ, немедленно сообщите нам об этом. Все действия, совершённые на Bustail лицом, авторизованным с помощью ваших данных для входа, будут считаться совершёнными вами. Ответственность за такие действия будете нести вы.
                    <br/>4. Сведения о пользователях
                    <br/>Сведения, которые вы предоставляете Компании о себе, должны быть достоверными, актуальными и не должны нарушать законодательство и права третьих лиц. Вы обязаны по мере необходимости обновлять их в своём профиле на Bustail. Мы можем запросить у вас документы или информацию для идентификации или подтверждения полномочий. Если вы их не предоставите, мы будем вправе ограничить доступ к вашему профилю.
                    Мы не можем гарантировать, что вся информация, которую пользователи указывают на Bustail, соответствует действительности. Будьте осмотрительны при совершении сделок.
                    Мы не раскрываем третьим лицам сведения о пользователях, которые не размещены в открытом доступе, за исключением случаев, предусмотренных законом (например, по запросу некоторых государственных органов). При этом мы не можем нести ответственность за сторонние неправомерные действия в отношении информации, которую вы разместили в открытом доступе на Bustail.
                    <br/>5. Пользовательский контент
                    <br/>Пользовательский контент — текст и изображения, которые пользователи Bustail размещают в объявлениях, публичной части профиля.
                    Компания не выступает распространителем пользовательского контента. Вы являетесь обладателем всей информации, которую размещаете на Bustail. Вы создаете, изменяете, размещаете в открытом доступе и удаляете контент без нашего участия или согласования.
                    Вы обязаны самостоятельно обеспечить полное соответствие пользовательского контента законодательству, Пользовательское соглашение Bustail. Вы гарантируете, что ваш контент не нарушает права третьих лиц на результаты интеллектуальной деятельности.
                    Bustail не занимается цензурой пользовательского контента. Мы предпринимаем действия в отношении контента на основании обращений уполномоченных лиц в установленном законом порядке.
                    Цель, с которой пользователи размещают информацию на Bustail — установить контакт с потенциальным клиентом или перевозчиком, который заинтересован в заключении сделки в отношении предложения в объявлении. Запрещено размещать заведомо ложную информацию. Запрещены сбор, копирование, использование и любые другие действия в отношении пользовательского контента в целях, не предусмотренных Соглашением. Нельзя использовать номера телефонов пользователей для целей, не связанных непосредственно с выполнением предложения у пользователя.
                    Вы предоставляете Компании право использовать ваш контент и включенные в него объекты интеллектуальной собственности на условиях неисключительной лицензии: бессрочно, без предоставления вознаграждения, любым способом, для действия во всем мире, как с указанием, так и без указания имени автора. Мы можем использовать ваш контент для исполнения Соглашений, улучшения Bustail, в маркетинговых целях, в коммерческих и некоммерческих проектах. Мы вправе размещать пользовательский контент на других интернет-ресурсах и предоставлять права на него нашим партнерам. Мы вправе сохранять архивные копии пользовательского контента и не изымать из оборота материалы, которые его содержат.
                    <br/>6. Обязанности пользователей
                    <br/>Используя Bustail и взаимодействуя с Компанией, вы обязуетесь:
                    <br/>•	строго выполнять все требования законодательства;
                    <br/>•	соблюдать Пользовательское соглашение Bustail и другие правила Bustail и указания Компании;
                    <br/>•	не звонить пользователям Bustail, если вы – не потенциальный клиент и не заинтересованы в заключении сделки по объявлению, не слать пользователям спам;
                    <br/>•	не использовать нецензурную лексику, изображения и высказывания, которые провоцируют жестокость, ненависть или неуважительное отношение, содержат угрозы или оскорбления, оправдывают незаконные действия, не соответствуют нравственным нормам или деловой практике;
                    <br/>•	не использовать Bustail или размещённую на Bustail информацию в целях, не предусмотренных Соглашением;
                    <br/>•	не загружать и не использовать на Bustail вредоносные программы;
                    <br/>•	не предпринимать действия, которые могут помешать нормальной работе Bustail.
                    <br/>7. Нарушения и последствия
                    <br/>Мы вправе принять меры при наличии оснований полагать, что с использованием вашего профиля или ваших технических средств произошло или может произойти нарушение законодательства, прав третьих лиц или Соглашений. Мы вправе ограничить доступ к вашему профилю или к какой-то функциональности Bustail, отклонить или заблокировать ваш контент. 
                    Мы можем ограничить доступ к профилю в случае поступления в отношении такого профиля жалоб других пользователей, рассылки спама, неоднократных или злостных нарушений Пользовательского соглашени, взлома профиля, непредоставления пользователем документов или информации по нашему запросу, ликвидации пользователя – юридического лица, а также если мы заметим в поведении пользователя на Bustail признаки мошенничества, либо при наличии иных подобных обстоятельств, либо если пользователь зарегистрировал новый профиль на Bustail вместо заблокированного ранее.
                    Мы вправе ограничить и восстановить доступ к профилю, а также определять условия такого восстановления на свое усмотрение и без пояснения причин.
                    Мы не несём ответственности за возможные убытки, причинённые пользователям в связи с принятием мер для предотвращения и прекращения нарушений на Bustail. Рекомендуем сохранять резервную копию вашего контента на вашем устройстве.
                    За нарушение законодательства или прав третьих лиц при использовании Bustail вы можете нести административную, уголовную или гражданско-правовую ответственность.
                    <br/>8. Услуги и стоимость услуг (цена)
                    <br/>Сервис предоставляет услуги по размещению объявлений о предложениях аренды транспорта и предложениях поездки, которые пользователи могут предлагать и искать на Bustail с целью заключения сделок бесплатно.
                    <br/>Перевозчики которые оказывают услуги по предложениям клиентов, после успешного выполнения заказа, перевозчикам начисляется фиксированная коммиссия (далее – «вознаграждение») в сторону сервиса Bustail в размере 250 (двести пятьдесят) рублей. Вознаграждение назначенены для дальнейшего улучшения сервиса Bustail. Перевозчик исключительно по собственному желанию может оплатить вознаграждение в Bustail за оказания услуги клиента  через Bustail с помощью формы оплаты в Личном кабинете перевозчика.
                    Текущую коммиссию перевозчика можно увидеть в Личном кабинет перевозчика.

                    <br/>9. Заключительные положения
                    <br/>Любая форма взаимодействия с Bustail (включая просмотр информации) подтверждает ваше согласие с Соглашением. Обязательства Компании предоставить доступ к функциональности Bustail – встречные по отношению к вашим обязательствам соблюдать Соглашение. Когда за использование Bustail плата не предусмотрена, законодательство о защите прав потребителей не применимо к отношениям между Компанией и пользователями. Предоставление определенной функциональности Bustail может регулироваться специальными условиями.
                    Функциональность Bustail в любой момент может изменяться, дополняться или прекращаться без предварительного уведомления пользователей. Использование Bustail предлагается в режиме «как есть», то есть в том виде и объёме, в каком Компания предоставляет функциональные возможности Bustail в момент обращения к ним. Мы не несём ответственности за временные сбои и перерывы в работе Bustail и вызванные ими потери информации. Мы не несем ответственность за любой косвенный, случайный, неумышленный ущерб, включая упущенную выгоду или потерянные данные, вред чести, достоинству или деловой репутации, причинённый в связи с использованием Bustail. Bustail предназначен для пользователей в Российской Федерации, поэтому некоторая функциональность может быть ограничена или недоступна за её пределами.
                    Bustail может содержать ссылки на сайты третьих лиц. Мы не контролируем и не несём ответственность за доступность, содержание и законность таких сторонних сайтов.
                    При разрешении всех споров между Компанией и пользователями применяется законодательство Российской Федерации. Все споры должны быть переданы на рассмотрение в суд в соответствии с территориальной подсудностью по месту нахождения Компании (г. Челябинск), если иное не предусмотрено законодательством.
                    Мы обновляем Условия использования Bustail по мере необходимости. Рекомендуем вам периодически посещать страницу, на которой они размещены: https://bustail.online/docs/terms. Продолжая пользоваться Bustail после изменения Соглашений, вы подтверждаете согласие с внесёнными в них изменениями.
                    <br/>Если у вас остались вопросы об Пользовательском соглашении Bustail, вы можете обратиться к специалистам службы поддержки.
                    <br/>
                    <br/>Почта: support@bustail.online
                    <br/>Телефон: 83512231251
                    <br/>ИП Грищенко Александр Алексеевич
                    <br/>ИНН 745116925545
                    <br/>ОГРНИП 320745600035739
                    <br/>454000 г. Челябинск, ул. Кузнецова д. 37, эт. 7, кв. 64
                    </p>
                </div>
            </React.Fragment>
            
        )
    }
}