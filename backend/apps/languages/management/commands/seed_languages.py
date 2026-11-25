"""
Management command to seed supported Indian languages and common travel phrases with accurate translations.
"""
from django.core.management.base import BaseCommand

from apps.languages.models import Language, TravelPhrase, PhraseTranslation


class Command(BaseCommand):
    help = 'Seeds supported languages and essential travel phrases with translations'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting seed process for languages and phrases...'))
        languages = self.seed_languages()
        self.seed_phrases_and_translations(languages)
        self.stdout.write(self.style.SUCCESS('Successfully seeded languages and phrases!'))

    def seed_languages(self):
        """Seed supported languages across India."""
        languages_data = [
            {"name": "Kannada", "code": "kn", "script": "Kannada", "supported": True},
            {"name": "Hindi", "code": "hi", "script": "Devanagari", "supported": True},
            {"name": "English", "code": "en", "script": "Latin", "supported": True},
            {"name": "Tamil", "code": "ta", "script": "Tamil", "supported": True},
            {"name": "Telugu", "code": "te", "script": "Telugu", "supported": True},
            {"name": "Malayalam", "code": "ml", "script": "Malayalam", "supported": True},
            {"name": "Marathi", "code": "mr", "script": "Devanagari", "supported": True},
            {"name": "Bengali", "code": "bn", "script": "Bengali", "supported": True},
            {"name": "Gujarati", "code": "gu", "script": "Gujarati", "supported": True},
        ]

        lang_map = {}
        for l in languages_data:
            obj, _ = Language.objects.update_or_create(
                code=l["code"],
                defaults={
                    "name": l["name"],
                    "script": l["script"],
                    "is_supported": l["supported"],
                }
            )
            lang_map[l["code"]] = obj

        self.stdout.write(f'Seeded {len(languages_data)} supported languages.')
        return lang_map

    def seed_phrases_and_translations(self, languages):
        """Seed essential travel phrases across multiple categories with accurate translations and pronunciation."""
        phrases_data = [
            # Greetings & Courtesies
            {
                "english": "Hello / Greetings",
                "category": "greeting",
                "translations": {
                    "kn": ("ನಮಸ್ಕಾರ", "Namaskara"),
                    "hi": ("नमस्ते", "Namaste"),
                    "ta": ("வணக்கம்", "Vanakkam"),
                    "te": ("నమస్కారం", "Namaskaram"),
                    "ml": ("നമസ്കാരം", "Namaskaram"),
                }
            },
            {
                "english": "Thank you very much",
                "category": "greeting",
                "translations": {
                    "kn": ("ತುಂಬಾ ಧನ್ಯವಾದಗಳು", "Tumba dhanyavadagalu"),
                    "hi": ("बहुत बहुत धन्यवाद", "Bahut bahut dhanyavaad"),
                    "ta": ("மிக்க நன்றி", "Mikka nandri"),
                    "te": ("చాలా ధన్యవాదాలు", "Chala dhanyavadalu"),
                    "ml": ("വളരെ നന്ദി", "Valare nandi"),
                }
            },
            {
                "english": "How are you?",
                "category": "greeting",
                "translations": {
                    "kn": ("ಹೇಗಿದ್ದೀರಾ?", "Hegiddira?"),
                    "hi": ("आप कैसे हैं?", "Aap kaise hain?"),
                    "ta": ("நீங்கள் எப்படி இருக்கிறீர்கள்?", "Neengal eppadi irukkeergal?"),
                    "te": ("మీరు ఎలా ఉన్నారు?", "Meeru ela unnaru?"),
                    "ml": ("സുഖമാണോ?", "Sukhamano?"),
                }
            },
            # Directions
            {
                "english": "Where is the railway station / bus stand?",
                "category": "direction",
                "translations": {
                    "kn": ("ರೈಲ್ವೆ ನಿಲ್ದಾಣ / ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?", "Railway nildhana / Bus stand ellide?"),
                    "hi": ("रेलवे स्टेशन / बस स्टैंड कहाँ है?", "Railway station / Bus stand kahan hai?"),
                    "ta": ("ரயில் நிலையம் / பேருந்து நிலையம் எங்கே உள்ளது?", "Rail nilayam / Perundhu nilayam engae ulladhu?"),
                    "te": ("రైల్వే స్టేషన్ / బస్ స్టాండ్ ఎక్కడ ఉంది?", "Railway station / Bus stand ekkada undi?"),
                    "ml": ("റെയിൽവേ സ്റ്റേഷൻ / ബസ് സ്റ്റാൻഡ് എവിടെയാണ്?", "Railway station / Bus stand evideyanu?"),
                }
            },
            {
                "english": "How far is this destination?",
                "category": "direction",
                "translations": {
                    "kn": ("ಇದು ಎಷ್ಟು ದೂರ ಇದೆ?", "Idu eshtu doora ide?"),
                    "hi": ("यह कितनी दूर है?", "Yeh kitni door hai?"),
                    "ta": ("இது எவ்வளவு தூரம்?", "Idhu evvalavu dhooram?"),
                    "te": ("ఇది ఎంత దూరం?", "Idi entha dooram?"),
                    "ml": ("ഇത് എത്ര ദൂരെയാണ്?", "Ithu ethra dooreyanu?"),
                }
            },
            # Transport
            {
                "english": "How much is the fare / ticket?",
                "category": "transport",
                "translations": {
                    "kn": ("ಟಿಕೆಟ್ ದರ ಎಷ್ಟು?", "Ticket dara eshtu?"),
                    "hi": ("किराया / टिकट कितना है?", "Kiraya / Ticket kitna hai?"),
                    "ta": ("கட்டணம் எவ்வளவு?", "Kattanam evvalavu?"),
                    "te": ("చార్జీ ఎంత?", "Charge entha?"),
                    "ml": ("ടിക്കറ്റ് നിരക്ക് എത്രയാണ്?", "Ticket nirakku ethrayanu?"),
                }
            },
            {
                "english": "Please turn on the meter (auto rickshaw)",
                "category": "transport",
                "translations": {
                    "kn": ("ಮೀಟರ್ ಹಾಕಿ ದಯವಿಟ್ಟು", "Meter haaki dayavittu"),
                    "hi": ("कृपया मीटर चालू करें", "Kripya meter chaalu karein"),
                    "ta": ("மீட்டர் போடுங்கள்", "Meter podungal"),
                    "te": ("దయచేసి మీటర్ వేయండి", "Dayachesi meter veyandi"),
                    "ml": ("മീറ്റർ ഇടാമോ ദയവായി", "Meter idamo dayavayi"),
                }
            },
            # Food & Dining
            {
                "english": "What vegetarian food is available?",
                "category": "food",
                "translations": {
                    "kn": ("ಶಾಖಾಹಾರಿ ಊಟ ಏನಿದೆ?", "Shaakahari oota yenide?"),
                    "hi": ("शाकाहारी खाना क्या उपलब्ध है?", "Shakahari khana kya uplabdh hai?"),
                    "ta": ("சைவ உணவு என்ன இருக்கிறது?", "Saiva unavu enna irukkiradhu?"),
                    "te": ("శాఖాహార భోజనం ఏమిటి ఉంది?", "Shakahara bhojanam emiti undi?"),
                    "ml": ("സസ്യാഹാരം എന്തൊക്കെയുണ്ട്?", "Sasyaharam enthokkeyundu?"),
                }
            },
            {
                "english": "Please make it less spicy",
                "category": "food",
                "translations": {
                    "kn": ("ಖಾರ ಕಡಿಮೆ ಮಾಡಿ ದಯವಿಟ್ಟು", "Khaara kadime maadi dayavittu"),
                    "hi": ("कृपया तीखा कम रखें", "Kripya teekha kam rakhein"),
                    "ta": ("காரம் குறைவாக போடுங்கள்", "Karam kuraivaga podungal"),
                    "te": ("దయచేసి కారం తక్కువ వేయండి", "Dayachesi karam thakkuva veyandi"),
                    "ml": ("എരിവ് കുറയ്ക്കൂ ദയവായി", "Erivu kuraykkoo dayavayi"),
                }
            },
            {
                "english": "Can I have clean drinking water?",
                "category": "food",
                "translations": {
                    "kn": ("ಕುಡಿಯುವ ಶುದ್ಧ ನೀರು ಸಿಗುವುದೇ?", "Kudiyuva shuddha neeru siguvudhe?"),
                    "hi": ("क्या पीने का स्वच्छ पानी मिल सकता है?", "Kya peene ka swachh paani mil sakta hai?"),
                    "ta": ("குடிநீர் கிடைக்குமா?", "Kudineer kidaikkuma?"),
                    "te": ("మంచినీళ్లు ఇస్తారా?", "Manchinillu isthara?"),
                    "ml": ("കുടിക്കാൻ നല്ല വെള്ളം കിട്ടുമോ?", "Kudikkan nalla vellam kittumo?"),
                }
            },
            # Shopping
            {
                "english": "How much does this cost?",
                "category": "shopping",
                "translations": {
                    "kn": ("ಇದರ ಬೆಲೆ ಎಷ್ಟು?", "Idara bele eshtu?"),
                    "hi": ("यह कितने का है?", "Yeh kitne ka hai?"),
                    "ta": ("இதன் விலை என்ன?", "Idhan vilai enna?"),
                    "te": ("దీని ఖరీదు ఎంత?", "Deeni khareedu entha?"),
                    "ml": ("ഇതിന് എത്ര രൂപയാണ്?", "Ithinu ethra roopayanu?"),
                }
            },
            {
                "english": "Can you give a discount / reduce the price?",
                "category": "shopping",
                "translations": {
                    "kn": ("ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡ್ತೀರಾ?", "Swalpa kadime maadtira?"),
                    "hi": ("क्या थोड़ा कम कर सकते हैं?", "Kya thoda kam kar sakte hain?"),
                    "ta": ("கொஞ்சம் குறைத்து கொடுப்பீர்களா?", "Konjam kuraithu koduppeerkgala?"),
                    "te": ("కొంచెం తగ్గిస్తారా?", "Konchem thaggisthara?"),
                    "ml": ("കുറച്ചു കുറയ്ക്കുമോ?", "Kurachu kuraykkumo?"),
                }
            },
            # Emergency
            {
                "english": "Help! Please help me!",
                "category": "emergency",
                "translations": {
                    "kn": ("ಸಹಾಯ ಮಾಡಿ! ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ!", "Sahaaya maadi! Dayavittu sahaaya maadi!"),
                    "hi": ("मदद करो! कृपया मेरी मदद कीजिए!", "Madad karo! Kripya meri madad kijiye!"),
                    "ta": ("உதவுங்கள்! தயவுசெய்து உதவுங்கள்!", "Udhavungal! Thayavuseidhu udhavungal!"),
                    "te": ("సహాయం చేయండి! దయచేసి సహాయం చేయండి!", "Sahayam cheyandi! Dayachesi sahayam cheyandi!"),
                    "ml": ("സഹായിക്കൂ! ദയവായി എന്നെ സഹായിക്കൂ!", "Sahayikku! Dayavayi enne sahayikku!"),
                }
            },
            {
                "english": "Where is the nearest hospital / doctor?",
                "category": "emergency",
                "translations": {
                    "kn": ("ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ / ವೈದ್ಯರು ಎಲ್ಲಿದ್ದಾರೆ?", "Hatthirada aaspatre / vaidyaru elliddare?"),
                    "hi": ("निकटतम अस्पताल / डॉक्टर कहाँ है?", "Nikat-tam aspatal / doctor kahan hai?"),
                    "ta": ("அருகிலுள்ள மருத்துவமனை எங்கே உள்ளது?", "Arugilulla maruthuvamanai engae ulladhu?"),
                    "te": ("దగ్గర్లోని హాస్పిటల్ / డాక్టర్ ఎక్కడ ఉన్నారు?", "Daggarloni hospital / doctor ekkada unnaru?"),
                    "ml": ("ഏറ്റവും അടുത്തുള്ള ആശുപത്രി എവിടെയാണ്?", "Ettavum aduthulla aashupathri evideyanu?"),
                }
            },
            {
                "english": "Please call the police (Emergency 112)",
                "category": "emergency",
                "translations": {
                    "kn": ("ಪೊಲೀಸರಿಗೆ ಕರೆ ಮಾಡಿ (112)", "Police-arige kare maadi (112)"),
                    "hi": ("कृपया पुलिस को बुलाइए (112)", "Kripya police ko bulaiye (112)"),
                    "ta": ("காவல்துறையை அழையுங்கள் (112)", "Kavalthuraiyai azhaiyungal (112)"),
                    "te": ("దయచేసి పోలీసులకు ఫోన్ చేయండి (112)", "Dayachesi policelaku phone cheyandi (112)"),
                    "ml": ("ദയവായി പോലീസിനെ വിളിക്കൂ (112)", "Dayavayi policine vilikku (112)"),
                }
            },
        ]

        phrase_count = 0
        translation_count = 0

        for item in phrases_data:
            phrase, _ = TravelPhrase.objects.update_or_create(
                english_text=item["english"],
                defaults={"category": item["category"]}
            )
            phrase_count += 1

            for lang_code, (trans_text, pron) in item["translations"].items():
                lang_obj = languages.get(lang_code)
                if lang_obj:
                    PhraseTranslation.objects.update_or_create(
                        phrase=phrase,
                        language=lang_obj,
                        defaults={
                            "translated_text": trans_text,
                            "pronunciation": pron,
                        }
                    )
                    translation_count += 1

        self.stdout.write(f'Seeded {phrase_count} phrases with {translation_count} translations.')
