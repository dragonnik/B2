import m from 'mithril'

import './_team.scss'
import berik from '../../../images/Berik 1.png'
import arrow_left from '../../../images/Arrow Left.png'
import arrow_right from '../../../images/Arrow Right.png'

export class Team{
    view() {
        return(
            <div class='team_area'>
                <div class='team_title'>Team</div>
                <div class='team_content_area'>
                    <div class='team_content_text'>
                        <div class='team_name'>Berik Kaniyev is a founder 2B Global Capital.</div>
                        <div class='team_content'>
                            Between 1994 and 1999 he managed his own oil processing and distribution business and worked as President of KBK Ltd, President of Kazneftecom Ltd and President of Neco Ltd. From 1998 to 1999 he was Vice-president of National Oil and Gas Company KazakhOil. Berik Kaniyev then served as Independent Advisor to the Prime-Minister of the Republic of Kazakhstan from 1999 to 2001. At present, he also serves on the Board of Directors of Syrymbet JSC and ERSAI LLP.<br/><br/>
                            Berik is also a member of the Young Presidents Organization (YPO) Kazakhstan and actively involved in a number of social projects. He is Chairman of the Board of Directors of Non-commercial JSC Republican Physics and Mathematics School (RPMS), a co-founder of its Alumni Fund and member of its Alumni Committee. An avid supporter of youth football, he is also a founder of Arlan football club and president of Kazakhstan League of Children-Youth Football Zhas Kyran.<br/><br/>
                            Berik is a graduate of Kazakh State University and holds an executive MBA degree from Duke University.
                        </div>
                    </div>
                    <div class='team_photo_area'>
                        <img src={ berik } class='team_photo'/>
                        <div class='team_photo_bg'></div>
                    </div>
                </div>
                <div class='team_switch_area'>
                    <img src={ arrow_left } class='arrow_left'/>
                    <img src={ arrow_right } class='arrow_right'/>
                </div>
            </div>
        )
    }
}