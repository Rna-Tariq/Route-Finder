import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    return (
        <div style={{
            margin: '10px',
            display: 'flex',
            justifyContent: 'flex-end'
        }}>
            <button
                onClick={() => changeLanguage('en')}
                style={{
                    padding: '5px 10px',
                    backgroundColor: i18n.language === 'en' ? '#00796b' : '#e0f2f1',
                    color: i18n.language === 'en' ? 'white' : '#00796b',
                    border: '1px solid #00796b',
                    borderRadius: '4px 0 0 4px',
                    cursor: 'pointer'
                }}
            >
                {t('language.en')}
            </button>
            <button
                onClick={() => changeLanguage('ar')}
                style={{
                    padding: '5px 10px',
                    backgroundColor: i18n.language === 'ar' ? '#00796b' : '#e0f2f1',
                    color: i18n.language === 'ar' ? 'white' : '#00796b',
                    border: '1px solid #00796b',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer'
                }}
            >
                {t('language.ar')}
            </button>
        </div>
    );
};

export default LanguageSwitcher;