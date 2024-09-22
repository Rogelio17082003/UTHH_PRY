import React from 'react';
import { Footer } from 'flowbite-react';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';
import SecondaryLogo from '../images/main-logo.png';

function FooterSection() {
    return (
        <Footer container className='Fotter mt-6'>
        <div className="w-full">
          <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
            <div>
              <img
                  src={SecondaryLogo}
                  alt="Company Logo"
                  className="h-30 w-60 p-4"
                />
            </div>
            <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
              <div>
                <Footer.Title title="Acerca de" />
                <Footer.LinkGroup col>
                  <Footer.Link href="#">Carretera Huejutla - Chalahuiyapa S/N, C.P. 43000, Huejutla de Reyes, Hidalgo.‍</Footer.Link>
                  <Footer.Link href="#">E-mail: rectoría@uthh.edu.mx</Footer.Link>
                </Footer.LinkGroup>
              </div>

              <div>
                <Footer.Title title="Terminos Legales" />
                <Footer.LinkGroup col>
                  <Footer.Link href="/Terminos">Terminos &amp; Condiciones</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
          <Footer.Divider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href="#" by="UTHH" year={2024} />
            {/*
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <Footer.Icon href="#" icon={BsFacebook} />
              <Footer.Icon href="#" icon={BsInstagram} />
              <Footer.Icon href="#" icon={BsTwitter} />
              <Footer.Icon href="#" icon={BsGithub} />
              <Footer.Icon href="#" icon={BsDribbble} />
            </div> */}
          </div>
        </div>
      </Footer>
    );
}

export default FooterSection;
