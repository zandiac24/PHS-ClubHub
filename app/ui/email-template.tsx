import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

type MessageUsEmailProps = {
  club_name: string;
  contactName: string;
  contactEmail: string;
};

const MessageUsEmail = ({ club_name, contactName, contactEmail }: MessageUsEmailProps) => {
  const previewText = `An new club application has been submitted.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans'>
          <Container className='my-[20px] mx-auto p-[20px] max-w-4xl'>
            <Heading className='text-black text-[20px] font-normal text-left'>
              <strong>Hello Mr. Young,</strong>
            </Heading>

            <Text className='text-black text-[14px] leading-[24px]'>
              Club Name: {club_name}
            </Text>

            <Text className='text-black text-[14px] leading-[24px]'>
              Sponsor Name: {contactName}
            </Text>

            <Text className='text-black text-[14px] leading-[24px]'>
              Sponsor Email: {contactEmail}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MessageUsEmail;