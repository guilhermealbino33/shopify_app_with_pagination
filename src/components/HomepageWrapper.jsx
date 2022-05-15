import React from 'react'
import {Page, Layout} from '@shopify/polaris'
import { HomePage } from './HomePage'
import { ProductsCard } from './ProductsCard'

const HomepageWrapper = () => {
  return (
    <Page title="Max's App Titlebar" fullWidth>
              <Layout>
                <Layout.Section>
                  <HomePage />
                </Layout.Section>
                <Layout.Section secondary>
                  <ProductsCard />
                </Layout.Section>
              </Layout>
            </Page>
  )
}

export default HomepageWrapper