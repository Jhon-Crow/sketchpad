import React from 'react';
import cls from './CapsLockIdentifier.module.scss'

const CapsLockIdentifier = ({capsLockPressed}) => {
    return (
        capsLockPressed
            ?
    <div className={cls.CapsLockIdentifier}>
        <p className={cls.paragraph}>
            <span className={cls.span}>C</span>APS
            <span className={cls.span}>L</span>OCK
        </p>
    </div>
            :
    <></>

    );
};

export default CapsLockIdentifier;