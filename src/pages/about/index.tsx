import { Box, Heading, ListItem, Text, UnorderedList } from '@chakra-ui/react';

const AboutPage = () => {
  return (
    <Box>
      <Heading size="md" my={6}>
        About
      </Heading>
      <Text>
        The purpose of this site is to be an effective tool for NYC Uber and Lyft drivers.
      </Text>
      <Text>
        The site is in work-in-progress state, and following features are planned to be added:
      </Text>
      <UnorderedList spacing={2} my={4}>
        <ListItem>
          <b>Trips:</b> Displays trip counts in between the selected dates and hours. This helps
          driver to have a better idea of which zones are busier in given time.
        </ListItem>
        <ListItem>
          <b>Earnings:</b> Displays earnings in between the selected dates. This helps driver to
          optimize working hours for maximizing earnings.
        </ListItem>
        <ListItem>
          <b>Deals:</b> Includes discounted deals of auto parts and services. This helps driver to
          lower the costs of maintenance and repairs.
        </ListItem>
        <ListItem>
          <b>Forum:</b> There will be a forum where drivers can exchange their ideas.
        </ListItem>
        <ListItem>
          <b>Shop:</b> Users will be able to list vehicles, plates and auto parts to buy/rent/sell.
        </ListItem>
      </UnorderedList>
    </Box>
  );
};

export default AboutPage;
